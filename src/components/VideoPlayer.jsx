import React, { useState, useEffect, useRef } from 'react';
import { Modal, Slider, Select, Button, Space, Tooltip } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  SoundOutlined, 
  FullscreenOutlined, 
  FullscreenExitOutlined,
  LoadingOutlined
} from '@ant-design/icons';

const { Option } = Select;

const VideoPlayer = ({ visible, file, onClose }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (visible && file) {
      // 重置状态
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setLoading(true);
      setPlaybackRate(1);
      setIsFullscreen(false);

      // 获取视频Blob URL
      file.getBlob((err, blob) => {
        if (err) {
          console.error('Get video blob error:', err);
          setLoading(false);
          return;
        }
        
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setLoading(false);
      });
    }

    return () => {
      // 清理Blob URL
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      
      // 退出全屏
      if (isFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error('Exit fullscreen error:', err);
        });
      }
    };
  }, [visible, file]);

  // 视频加载完成事件
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // 播放/暂停切换
  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  // 时间更新事件
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // 进度条拖动
  const handleProgressChange = (value) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  // 音量调节
  const handleVolumeChange = (value) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVolume(value);
    }
  };

  // 倍速切换
  const handlePlaybackRateChange = (value) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
      setPlaybackRate(value);
    }
  };

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 格式化时间
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      title={file?.name}
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90%"
      centered
      closeIconProps={{ style: { fontSize: '20px' } }}
      bodyStyle={{ padding: 0 }}
    >
      <div ref={containerRef} style={{ position: 'relative', width: '100%', background: '#000' }}>
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            color: '#fff'
          }}>
            <Space>
              <LoadingOutlined spin size="large" />
              <span>视频加载中...</span>
            </Space>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              style={{ width: '100%', maxHeight: '70vh' }}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setPlaying(false)}
              onError={(e) => {
                console.error('Video play error:', e);
                setLoading(false);
              }}
              volume={volume}
            />
            
            {/* 视频控制栏 */}
            <div style={{ 
              padding: '12px', 
              background: 'rgba(0, 0, 0, 0.8)', 
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {/* 进度条 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', minWidth: '45px' }}>
                  {formatTime(currentTime)}
                </span>
                <Slider
                  style={{ flex: 1 }}
                  value={currentTime}
                  max={duration || 100}
                  onChange={handleProgressChange}
                  tooltip={{ formatter: (value) => formatTime(value) }}
                />
                <span style={{ fontSize: '12px', minWidth: '45px', textAlign: 'right' }}>
                  {formatTime(duration)}
                </span>
              </div>
              
              {/* 控制按钮 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space>
                  <Button 
                    type="text" 
                    icon={playing ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                    onClick={togglePlay}
                    size="large"
                    style={{ color: '#fff', fontSize: '20px' }}
                  />
                  
                  <Space style={{ alignItems: 'center', gap: '8px' }}>
                    <SoundOutlined style={{ fontSize: '16px' }} />
                    <Slider
                      style={{ width: '100px' }}
                      value={volume}
                      onChange={handleVolumeChange}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </Space>
                  
                  <Select
                    value={playbackRate}
                    onChange={handlePlaybackRateChange}
                    style={{ width: '80px' }}
                    size="small"
                  >
                    <Option value={0.5}>0.5x</Option>
                    <Option value={0.75}>0.75x</Option>
                    <Option value={1}>1x</Option>
                    <Option value={1.25}>1.25x</Option>
                    <Option value={1.5}>1.5x</Option>
                    <Option value={2}>2x</Option>
                  </Select>
                </Space>
                
                <Button 
                  type="text" 
                  icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                  onClick={toggleFullscreen}
                  size="large"
                  style={{ color: '#fff', fontSize: '18px' }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default VideoPlayer;