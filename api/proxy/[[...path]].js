import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = createProxyMiddleware({
  target: 'http://file.malexple.ru', // Замените на нужный URL
  changeOrigin: true,
  pathRewrite: { '^/api/proxy': '' }, // Удаляет префикс пути (если нужно)
  followRedirects: true,
});

export default function handler(req, res) {
  req.body = null; // Отключаем парсинг тела запроса
  proxy(req, res, (err) => {
    if (err) {
      res.status(500).end();
    }
  });
}

// Отключаем встроенный парсинг тела запроса
export const config = {
  api: {
    bodyParser: false,
  },
};