import React, { useState } from 'react';
import { Input, Button, Card, message } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';

const { Search } = Input;

const MagnetInput = ({ onMagnetParse }) => {
  const [magnetUrl, setMagnetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleParse = async () => {
    const trimmedUrl = magnetUrl.trim();
    try {
      // 简单验证磁力链接格式
      if (!trimmedUrl) {
        messageApi.error('请输入磁力链接');
        return;
      }

      // 简单验证磁力链接格式
      if (!trimmedUrl.startsWith('magnet:?xt=urn:btih:')) {
        messageApi.error('请输入有效的磁力链接');
        return;
      }

      setLoading(true);
      await onMagnetParse(trimmedUrl);
      messageApi.success('磁力链接解析成功');
      setMagnetUrl('');
    } catch (error) {
      messageApi.error('解析失败');
      console.error('Magnet parse error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Card title="或输入磁力链接" variant="outlined" className="magnet-card">
        <Search
          placeholder="请输入磁力链接"
          allowClear
          enterButton={loading ? <LoadingOutlined /> : <SearchOutlined />}
          size="large"
          loading={loading}
          value={magnetUrl}
          onChange={(e) => setMagnetUrl(e.target.value)}
          onSearch={handleParse}
          onPressEnter={handleParse}
          style={{ width: '100%' }}
        />
        <div style={{ marginTop: 12, fontSize: '12px', color: '#999' }}>
          示例：magnet:?xt=urn:btih:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        </div>
      </Card>
    </>
  );
};

export default MagnetInput;