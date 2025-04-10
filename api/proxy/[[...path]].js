const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = createProxyMiddleware({ target: 'https://google.com' });
module.exports = (req, res) => proxy(req, res);