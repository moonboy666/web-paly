import { handleTorrentInfo } from './handlers/torrentInfo.js';
import { handleTorrentParse } from './handlers/torrentParse.js';
import { handleParseTorrent } from './handlers/parseTorrent.js';
import { handleParseMagnet } from './handlers/parseMagnet.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // API路由处理
    if (pathname === '/api/torrent-info' && request.method === 'GET') {
      return handleTorrentInfo(request, env);
    }
    if (pathname === '/api/torrent-parse' && request.method === 'POST') {
      return handleTorrentParse(request, env);
    }
    // 兼容原有前端API调用
    if (pathname === '/api/parse-torrent' && request.method === 'POST') {
      return handleParseTorrent(request, env);
    }
    if (pathname === '/api/parse-magnet' && request.method === 'POST') {
      return handleParseMagnet(request, env);
    }

    // 其他路由返回404
    return new Response('Not Found', { status: 404 });
  }
};
