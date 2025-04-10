const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  target: 'http://file.malexple.ru',
  changeOrigin: true,
  secure: false, // Отключаем проверку SSL (если нет HTTPS)
  cookieDomainRewrite: 'localhost', // Важно для сессий
  onProxyReq: (proxyReq, req) => {
    // Добавляем заголовки для обхода CSRF
    proxyReq.setHeader('Referer', 'http://file.malexple.ru');
    proxyReq.setHeader('X-Forwarded-Host', 'file.malexple.ru');
  },
  onProxyRes: (proxyRes) => {
    // Фиксим куки для локального хоста
    const cookies = proxyRes.headers['set-cookie'];
    if (cookies) {
      proxyRes.headers['set-cookie'] = cookies.map(cookie =>
        cookie.replace(/Domain=file.malexple.ru;?/i, 'Domain=localhost;')
      );
    }
  }
});

module.exports = (req, res) => {
  proxy(req, res);
};

module.exports.config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};