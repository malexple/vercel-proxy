import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = createProxyMiddleware({
  target: 'http://file.malexple.ru', // Замените на нужный URL
  changeOrigin: true,
  pathRewrite: { '^/api/proxy': '' },
  followRedirects: true,
});

export default function (req, res) {
  req.body = null;
  proxy(req, res, (err) => {
    if (err) {
      res.status(500).end();
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};