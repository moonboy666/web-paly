export async function handleParseTorrent(request, env) {
  try {
    // 解析表单数据
    const formData = await request.formData();
    const torrentFile = formData.get('torrent');
    
    if (!torrentFile) {
      return new Response(JSON.stringify({ error: '请上传种子文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // 模拟种子解析结果
    // 实际应用中，这里应该使用parse-torrent-file库解析种子文件
    const parsedData = {
      success: true,
      info: {
        name: '示例种子',
        infoHash: 'dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c',
        files: 3,
        length: 1024 * 1024 * 1024 // 1GB
      },
      files: [
        { name: 'file1.mp4', path: 'file1.mp4', length: 500 * 1024 * 1024, type: 'video' },
        { name: 'file2.jpg', path: 'file2.jpg', length: 2 * 1024 * 1024, type: 'image' },
        { name: 'file3.txt', path: 'file3.txt', length: 100 * 1024, type: 'other' }
      ]
    };

    return new Response(JSON.stringify(parsedData), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || '解析种子文件失败，请稍后重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}
