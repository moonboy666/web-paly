export async function handleTorrentParse(request, env) {
  try {
    const body = await request.json();
    const { infoHash } = body;
    
    if (!infoHash) {
      return new Response(JSON.stringify({ error: '缺少infoHash参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // 模拟种子解析结果
    const parsedData = {
      infoHash: infoHash,
      files: [
        { name: 'file1.mp4', size: 500 * 1024 * 1024, type: 'video' },
        { name: 'file2.jpg', size: 2 * 1024 * 1024, type: 'image' },
        { name: 'file3.txt', size: 100 * 1024, type: 'other' }
      ]
    };

    return new Response(JSON.stringify({ success: true, data: parsedData }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}
