var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-HEHwe3/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// worker/handlers/torrentInfo.js
async function handleTorrentInfo(request, env) {
  try {
    const url = new URL(request.url);
    const infoHash = url.searchParams.get("infoHash");
    if (!infoHash) {
      return new Response(JSON.stringify({ error: "\u7F3A\u5C11infoHash\u53C2\u6570" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    const torrentInfo = {
      name: "\u793A\u4F8B\u79CD\u5B50",
      infoHash,
      files: 10,
      length: 1024 * 1024 * 1024
      // 1GB
    };
    return new Response(JSON.stringify({ success: true, data: torrentInfo }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
__name(handleTorrentInfo, "handleTorrentInfo");

// worker/handlers/torrentParse.js
async function handleTorrentParse(request, env) {
  try {
    const body = await request.json();
    const { infoHash } = body;
    if (!infoHash) {
      return new Response(JSON.stringify({ error: "\u7F3A\u5C11infoHash\u53C2\u6570" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    const parsedData = {
      infoHash,
      files: [
        { name: "file1.mp4", size: 500 * 1024 * 1024, type: "video" },
        { name: "file2.jpg", size: 2 * 1024 * 1024, type: "image" },
        { name: "file3.txt", size: 100 * 1024, type: "other" }
      ]
    };
    return new Response(JSON.stringify({ success: true, data: parsedData }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
__name(handleTorrentParse, "handleTorrentParse");

// worker/handlers/parseTorrent.js
async function handleParseTorrent(request, env) {
  try {
    const formData = await request.formData();
    const torrentFile = formData.get("torrent");
    if (!torrentFile) {
      return new Response(JSON.stringify({ error: "\u8BF7\u4E0A\u4F20\u79CD\u5B50\u6587\u4EF6" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    const parsedData = {
      success: true,
      info: {
        name: "\u793A\u4F8B\u79CD\u5B50",
        infoHash: "dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c",
        files: 3,
        length: 1024 * 1024 * 1024
        // 1GB
      },
      files: [
        { name: "file1.mp4", path: "file1.mp4", length: 500 * 1024 * 1024, type: "video" },
        { name: "file2.jpg", path: "file2.jpg", length: 2 * 1024 * 1024, type: "image" },
        { name: "file3.txt", path: "file3.txt", length: 100 * 1024, type: "other" }
      ]
    };
    return new Response(JSON.stringify(parsedData), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "\u89E3\u6790\u79CD\u5B50\u6587\u4EF6\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
__name(handleParseTorrent, "handleParseTorrent");

// worker/handlers/parseMagnet.js
function parseMagnetUrl(magnetUrl) {
  const infoHashMatch = magnetUrl.match(/xt=urn:btih:([a-fA-F0-9]{40})/);
  const nameMatch = magnetUrl.match(/dn=([^&]+)/);
  if (!infoHashMatch) {
    throw new Error("\u65E0\u6548\u7684\u78C1\u529B\u94FE\u63A5\uFF0C\u7F3A\u5C11infoHash");
  }
  return {
    infoHash: infoHashMatch[1],
    name: nameMatch ? decodeURIComponent(nameMatch[1]) : "\u672A\u77E5\u540D\u79F0"
  };
}
__name(parseMagnetUrl, "parseMagnetUrl");
async function handleParseMagnet(request, env) {
  try {
    const body = await request.json();
    const { magnetUrl } = body;
    if (!magnetUrl) {
      return new Response(JSON.stringify({ error: "\u8BF7\u63D0\u4F9B\u78C1\u529B\u94FE\u63A5" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    const parsed = parseMagnetUrl(magnetUrl);
    const files = [{
      name: parsed.name || "\u672A\u77E5\u6587\u4EF6",
      path: parsed.name || "\u672A\u77E5\u6587\u4EF6",
      length: 0,
      type: "other"
    }];
    const parsedData = {
      success: true,
      info: {
        name: parsed.name || "\u672A\u77E5\u540D\u79F0",
        infoHash: parsed.infoHash,
        files: files.length,
        length: 0
      },
      files
    };
    return new Response(JSON.stringify(parsedData), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "\u89E3\u6790\u78C1\u529B\u94FE\u63A5\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
__name(handleParseMagnet, "handleParseMagnet");

// worker/index.js
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (pathname === "/api/torrent-info" && request.method === "GET") {
      return handleTorrentInfo(request, env);
    }
    if (pathname === "/api/torrent-parse" && request.method === "POST") {
      return handleTorrentParse(request, env);
    }
    if (pathname === "/api/parse-torrent" && request.method === "POST") {
      return handleParseTorrent(request, env);
    }
    if (pathname === "/api/parse-magnet" && request.method === "POST") {
      return handleParseMagnet(request, env);
    }
    return new Response("Not Found", { status: 404 });
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-HEHwe3/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-HEHwe3/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
