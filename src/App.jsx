import React, { useState } from 'react';
import { ConfigProvider, Layout, Typography, message, Spin, Alert, Modal } from 'antd';
import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';

// 导入组件
import UploadArea from './components/UploadArea';
import MagnetInput from './components/MagnetInput';
import FileList from './components/FileList';

// 导入样式
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  // 应用状态
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [torrentInfo, setTorrentInfo] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  
  // 文件预览和播放状态
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // 处理种子文件上传成功
  const handleUploadSuccess = async (buffer, filename) => {
    setLoading(true);
    setError(null);

    try {
      // 创建FormData对象
      const formData = new FormData();
      const blob = new Blob([buffer], { type: 'application/x-bittorrent' });
      formData.append('torrent', blob, filename);

      // 调用后端API解析种子文件
      const response = await fetch('https://bt-torrent-worker.haohaolovegaogao.workers.dev/api/parse-torrent', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setTorrentInfo(data.info);
        setFiles(data.files);
        setLoading(false);
        messageApi.success(`成功解析种子，共包含 ${data.files.length} 个文件`);
      } else {
        throw new Error(data.error || '解析种子文件失败');
      }
    } catch (err) {
      console.error('Parse torrent error:', err);
      setError(err.message || '解析种子文件失败，请稍后重试');
      messageApi.error('解析种子文件失败');
      setLoading(false);
    }
  };

  // 处理磁力链接解析
  const handleMagnetParse = async (magnetUrl) => {
    setLoading(true);
    setError(null);

    try {
      // 调用后端API解析磁力链接
      const response = await fetch('https://bt-torrent-worker.haohaolovegaogao.workers.dev/api/parse-torrent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ magnetUrl }),
      });

      const data = await response.json();
      if (data.success) {
        setTorrentInfo(data.info);
        setFiles(data.files);
        setLoading(false);
        if (data.files.length === 0) {
          messageApi.info(`成功解析磁力链接，但磁力链接只包含基本信息，无法获取完整的文件列表。建议上传.torrent文件以查看完整的文件列表。`);
        } else {
          messageApi.success(`成功解析种子，共包含 ${data.files.length} 个文件`);
        }
      } else {
        throw new Error(data.error || '解析磁力链接失败');
      }
    } catch (err) {
      console.error('Parse magnet error:', err);
      setError(err.message || '解析磁力链接失败，请稍后重试');
      messageApi.error('解析磁力链接失败');
      setLoading(false);
    }
  };

  // 处理文件点击，实现预览和播放
  const handleFileClick = (file) => {
    setPreviewFile(file);
    setPreviewVisible(true);
    setIsPreviewLoading(true);
  };
  
  // 关闭预览窗口
  const handlePreviewClose = () => {
    setPreviewVisible(false);
    setPreviewFile(null);
    setIsPreviewLoading(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <>
        {contextHolder}
        <Layout className="app-layout">
          {/* 头部 */}
          <Header className="app-header">
            <div className="app-header-content">
              <DownloadOutlined style={{ fontSize: '24px', marginRight: '12px', color: '#fff' }} />
              <Title level={2} style={{ color: '#fff', margin: 0 }}>BT种子解析器</Title>
            </div>
          </Header>

          {/* 内容区 */}
          <Content className="app-content">
            <div className="app-container">
            {/* 错误提示 */}
            {error && (
              <Alert
                title="错误"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                style={{ marginBottom: '16px' }}
              />
            )}

            {/* 种子信息 */}
            {torrentInfo && (
              <Alert
                title="种子信息"
                description={
                  <div>
                    <p><strong>名称：</strong>{torrentInfo.name}</p>
                    <p><strong>文件数量：</strong>{torrentInfo.files}</p>
                    <p><strong>总大小：</strong>{formatFileSize(torrentInfo.length)}</p>
                    <p><strong>InfoHash：</strong>{torrentInfo.infoHash}</p>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
              />
            )}

            {/* 主要功能区 */}
            <div className="main-content">
              {/* 上传区域 */}
              <div className="upload-section">
                <UploadArea onUploadSuccess={handleUploadSuccess} />
              </div>

              {/* 磁力链接区域 */}
              <div className="magnet-section">
                <MagnetInput onMagnetParse={handleMagnetParse} />
              </div>
            </div>

            {/* 文件列表 */}
            <div className="file-section">
              <Spin spinning={loading} tip="正在解析种子...">
                <FileList files={files} onFileClick={handleFileClick} />
              </Spin>
            </div>

            {/* 提示信息 */}
            {files.length === 0 && !loading && (
              <div className="empty-tip">
                <InfoCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <p style={{ color: '#999', fontSize: '14px' }}>
                  请上传种子文件或输入磁力链接开始解析
                </p>
              </div>
            )}
          </div>
        </Content>
      </Layout>
      
      {/* 文件预览窗口 */}
      <Modal
        title={previewFile ? previewFile.name : '文件预览'}
        open={previewVisible}
        onCancel={handlePreviewClose}
        footer={null}
        width={800}
        centered
      >
        {isPreviewLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin tip="正在加载文件..." size="large" />
          </div>
        ) : previewFile ? (
          <div style={{ textAlign: 'center' }}>
            {previewFile.type === 'video' ? (
              <div>
                <video
                  controls
                  src={`http://localhost:3001/api/preview/${torrentInfo.infoHash}/${encodeURIComponent(previewFile.name)}`}
                  style={{ width: '100%', maxHeight: '600px', border: '1px solid #d9d9d9', borderRadius: '8px' }}
                  onLoadedData={() => setIsPreviewLoading(false)}
                  onError={(e) => {
                    console.error('视频加载失败:', e);
                    messageApi.error('视频加载失败，请稍后重试');
                    setIsPreviewLoading(false);
                  }}
                />
              </div>
            ) : previewFile.type === 'image' ? (
              <div>
                <img
                  src={`http://localhost:3001/api/preview/${torrentInfo.infoHash}/${encodeURIComponent(previewFile.name)}`}
                  alt={previewFile.name}
                  style={{ maxWidth: '100%', maxHeight: '600px', border: '1px solid #d9d9d9', borderRadius: '8px' }}
                  onLoad={() => setIsPreviewLoading(false)}
                  onError={(e) => {
                    console.error('图片加载失败:', e);
                    messageApi.error('图片加载失败，请稍后重试');
                    setIsPreviewLoading(false);
                  }}
                />
              </div>
            ) : (
              <div style={{ padding: '40px 0' }}>
                <p>当前版本仅支持视频和图片文件的预览</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>无法预览该文件</p>
          </div>
        )}
      </Modal>
      </>
    </ConfigProvider>
  );
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default App;