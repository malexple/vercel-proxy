import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = createProxyMiddleware({
  target: 'http://file.malexple.ru', // Замените на нужный URL
  changeOrigin: true,
  pathRewrite: { '^/api/proxy': '' },
  followRedirects: true,
});

export default function (req, res) {
  // В код прокси (перед вызовом proxy())
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log('Запрос к:', req.url); // Логировать URL
  req.body = null;
  proxy(req, res, (err) => {
    if (err) {
      console.error('Ошибка:', err);
      res.status(500).end();
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};