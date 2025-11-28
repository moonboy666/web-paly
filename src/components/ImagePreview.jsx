import React, { useState, useEffect } from 'react';
import { Modal, Button, Space } from 'antd';
import { 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  ReloadOutlined, 
  LeftOutlined, 
  RightOutlined 
} from '@ant-design/icons';

const ImagePreview = ({ visible, file, onClose }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    if (visible && file) {
      // 重置状态
      setScale(1);
      setRotate(0);
      setLoading(true);

      // 获取图片Blob URL
      file.getBlob((err, blob) => {
        if (err) {
          console.error('Get image blob error:', err);
          setLoading(false);
          return;
        }
        
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        setLoading(false);
      });
    }

    return () => {
      // 清理Blob URL
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [visible, file]);

  // 缩放操作
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setRotate(0);
  };

  // 旋转操作
  const handleRotate = () => {
    setRotate(prev => (prev + 90) % 360);
  };

  // 图片样式
  const imageStyle = {
    transform: `scale(${scale}) rotate(${rotate}deg)`,
    transition: 'transform 0.3s ease',
    maxWidth: '100%',
    maxHeight: '80vh',
    objectFit: 'contain',
  };

  return (
    <Modal
      title={file?.name}
      open={visible}
      onCancel={onClose}
      footer={null}
      width="80%"
      centered
      closeIconProps={{ style: { fontSize: '20px' } }}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        {loading ? (
          <div style={{ padding: '50px 0' }}>加载中...</div>
        ) : (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={imageUrl}
              alt={file?.name}
              style={imageStyle}
              onError={(e) => {
                console.error('Image load error:', e);
                setLoading(false);
              }}
            />
          </div>
        )}

        <Space style={{ marginTop: 20 }}>
          <Button 
            icon={<ZoomInOutlined />} 
            onClick={handleZoomIn}
            disabled={scale >= 3}
          >
            放大
          </Button>
          <Button 
            icon={<ZoomOutOutlined />} 
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
          >
            缩小
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
          >
            重置
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRotate}
          >
            旋转
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default ImagePreview;