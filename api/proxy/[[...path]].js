const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  target: 'http://file.malexple.ru', // Используйте HTTPS, если сайт поддерживает
  changeOrigin: true,
  pathRewrite: { '^/api/proxy': '' }, // Удалите, если не требуется
  on: {
    proxyReq: (proxyReq, req) => {
      console.log('Проксируем запрос на:', req.url);
    },
    error: (err, req, res) => {
      console.error('Ошибка прокси:', err);
      res.status(500).end();
    }
  }
});

module.exports = (req, res) => {
  // Пропускаем запросы к статическим файлам
  if (req.url.includes('favicon.ico')) {
    return res.status(404).end();
  }

  proxy(req, res);
};

module.exports.config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};