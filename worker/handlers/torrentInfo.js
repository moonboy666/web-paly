export async function handleTorrentInfo(request, env) {
  try {
    const url = new URL(request.url);
    const infoHash = url.searchParams.get('infoHash');
    
    if (!infoHash) {
      return new Response(JSON.stringify({ error: '缺少infoHash参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // 模拟种子基础信息查询
    const torrentInfo = {
      name: '示例种子',
      infoHash: infoHash,
      files: 10,
      length: 1024 * 1024 * 1024 // 1GB
    };

    return new Response(JSON.stringify({ success: true, data: torrentInfo }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}
