import React from 'react';
import { Upload, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadArea = ({ onUploadSuccess }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleUpload = async (file) => {
    try {
      // 检查文件类型
      if (!file.name.endsWith('.torrent')) {
        messageApi.error('请上传有效的种子文件');
        return false;
      }

      // 读取文件内容
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      
      return new Promise((resolve, reject) => {
        reader.onload = (e) => {
          const buffer = e.target.result;
          onUploadSuccess(buffer, file.name);
          messageApi.success('种子文件上传成功');
          resolve(true);
        };
        
        reader.onerror = (error) => {
          messageApi.error('文件读取失败');
          reject(error);
        };
      });
    } catch (error) {
      messageApi.error('上传失败');
      console.error('Upload error:', error);
      return false;
    }
  };

  return (
    <>
      {contextHolder}
      <Card title="上传种子文件" variant="outlined" className="upload-card">
        <Upload
          name="torrent-file"
          accept=".torrent"
          beforeUpload={handleUpload}
          showUploadList={false}
          drag
        >
          <div style={{ padding: '20px 0' }}>
            <UploadOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
            <p style={{ marginTop: 16 }}>拖拽种子文件到此处或 <span style={{ color: '#1890ff' }}>点击选择文件</span></p>
            <p style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>支持 .torrent 格式文件</p>
          </div>
        </Upload>
      </Card>
    </>
  );
};

export default UploadArea;