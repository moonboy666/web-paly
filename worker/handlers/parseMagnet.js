// 解析磁力链接的函数
function parseMagnetUrl(magnetUrl) {
  // 正则表达式匹配磁力链接的infoHash和dn参数
  const infoHashMatch = magnetUrl.match(/xt=urn:btih:([a-fA-F0-9]{40})/);
  const nameMatch = magnetUrl.match(/dn=([^&]+)/);
  
  if (!infoHashMatch) {
    throw new Error('无效的磁力链接，缺少infoHash');
  }
  
  return {
    infoHash: infoHashMatch[1],
    name: nameMatch ? decodeURIComponent(nameMatch[1]) : '未知名称'
  };
}

export async function handleParseMagnet(request, env) {
  try {
    const body = await request.json();
    const { magnetUrl } = body;
    
    if (!magnetUrl) {
      return new Response(JSON.stringify({ error: '请提供磁力链接' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 解析磁力链接
    const parsed = parseMagnetUrl(magnetUrl);

    // 对于磁力链接，我们只能获取基本信息，无法获取完整的文件列表
    // 所以这里创建一个虚拟的文件列表
    const files = [{
      name: parsed.name || '未知文件',
      path: parsed.name || '未知文件',
      length: 0,
      type: 'other'
    }];

    const parsedData = {
      success: true,
      info: {
        name: parsed.name || '未知名称',
        infoHash: parsed.infoHash,
        files: files.length,
        length: 0
      },
      files
    };

    return new Response(JSON.stringify(parsedData), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || '解析磁力链接失败，请稍后重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
