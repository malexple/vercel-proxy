import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = createProxyMiddleware({
  target: 'http://file.malexple.ru', // Или https://
  changeOrigin: true,
  pathRewrite: { '^/api/proxy': '' }, // Удалите, если не нужно
  onProxyRes: (proxyRes) => {
    // Добавьте CORS-заголовки, если нужно
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
});

export default function handler(req, res) {
  proxy(req, res, (err) => {
    if (err) {
      console.error('Proxy error:', err);
      res.status(500).end();
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};