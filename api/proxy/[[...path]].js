const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  target: 'http://file.malexple.ru', // Убедитесь, что URL корректен
  changeOrigin: true,
  pathRewrite: { '^/api/proxy': '' }, // Удалите, если не нужно
  onProxyRes: (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*'; // Добавьте CORS
  },
});

module.exports = (req, res) => {
  proxy(req, res, (err) => {
    if (err) {
      console.error('Proxy error:', err);
      res.status(500).end();
    }
  });
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};