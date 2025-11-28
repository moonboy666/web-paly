import React, { useState } from 'react';
import { Table, Card, Input, Tag, Space, Tooltip } from 'antd';
import { 
  PictureOutlined, 
  VideoCameraOutlined, 
  FileTextOutlined, 
  SearchOutlined 
} from '@ant-design/icons';

const { Search } = Input;

const FileList = ({ files, onFileClick }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredType, setFilteredType] = useState('all');

  // 文件类型图标映射
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image':
        return <PictureOutlined style={{ color: '#1890ff' }} />;
      case 'video':
        return <VideoCameraOutlined style={{ color: '#e74c3c' }} />;
      default:
        return <FileTextOutlined style={{ color: '#95a5a6' }} />;
    }
  };

  // 文件类型标签
  const getFileTypeTag = (fileType) => {
    switch (fileType) {
      case 'image':
        return <Tag color="blue">图片</Tag>;
      case 'video':
        return <Tag color="red">视频</Tag>;
      default:
        return <Tag color="gray">其他</Tag>;
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 过滤文件
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filteredType === 'all' || file.type === filteredType;
    return matchesSearch && matchesType;
  });

  // 表格列配置
  const columns = [
    {
      title: '文件',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {getFileIcon(record.type)}
          <Tooltip title={text}>
            <span style={{ cursor: 'pointer', color: '#1890ff' }} onClick={() => onFileClick(record)}>
              {text}
            </span>
          </Tooltip>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => getFileTypeTag(text),
      filters: [
        { text: '全部', value: 'all' },
        { text: '图片', value: 'image' },
        { text: '视频', value: 'video' },
        { text: '其他', value: 'other' },
      ],
      onFilter: (value, record) => value === 'all' || record.type === value,
      filterSearch: false,
    },
    {
      title: '大小',
      dataIndex: 'length',
      key: 'length',
      render: (text) => formatFileSize(text),
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => onFileClick(record)} style={{ color: '#1890ff' }}>
            {record.type === 'image' ? '预览' : record.type === 'video' ? '播放' : '查看'}
          </a>
        </Space>
      ),
    },
  ];

  return (
    <Card title="文件列表" variant="outlined" className="file-list-card">
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Search
          placeholder="搜索文件名"
          allowClear
          enterButton={<SearchOutlined />}
          size="middle"
          onSearch={(value) => setSearchText(value)}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredFiles}
        rowKey={(record) => record.path}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 个文件`,
        }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
};

export default FileList;