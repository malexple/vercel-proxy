import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = createProxyMiddleware({
  target: 'http://file.malexple.ru',
  changeOrigin: true,
});

export default (req, res) => {
  proxy(req, res);
};

export const config = {
  api: {
    bodyParser: false,
  },
};