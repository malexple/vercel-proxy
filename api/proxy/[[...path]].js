const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  target: 'http://file.malexple.ru',
  changeOrigin: true,
  cookieDomainRewrite: {
    '*': 'localhost', // Переписываем все домены в localhost
  },
  onProxyReq: (proxyReq, req) => {
    // Добавляем CSRF-токен из куки в заголовок
    if (req.cookies && req.cookies.csrftoken) {
      proxyReq.setHeader('X-CSRFToken', req.cookies.csrftoken);
    }

    // Фиксим Referer для Django
    proxyReq.setHeader('Referer', 'http://file.malexple.ru');
  },
  onProxyRes: (proxyRes) => {
    // Фиксим Set-Cookie заголовки
    const cookies = proxyRes.headers['set-cookie'];
    if (cookies) {
      proxyRes.headers['set-cookie'] = cookies.map(cookie =>
        cookie
          .replace(/Domain=file\.malexple\.ru;?/gi, 'Domain=localhost;')
          .replace(/Secure;?/gi, '')
          .replace(/SameSite=Lax;?/gi, 'SameSite=None; Secure')
      );
    }
  }
});

module.exports = (req, res) => {
  // Сохраняем куки из запроса
  req.cookies = require('cookie').parse(req.headers.cookie || '');

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
    externalResolver: true
  }
};