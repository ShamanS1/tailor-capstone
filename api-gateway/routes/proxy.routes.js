const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '/auth' },
  }));

  app.use('/api/measurements', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: { '^/api/measurements': '/measurements' },
  }));

  app.use('/api/orders', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
    pathRewrite: { '^/api/orders': '/orders' },
  }));

  app.use('/api/tailors', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
    pathRewrite: { '^/api/tailors': '/tailors' },
  }));

  app.use('/api/notifications', createProxyMiddleware({
    target: 'http://localhost:3005',
    changeOrigin: true,
    pathRewrite: { '^/api/notifications': '/notifications' },
  }));

  app.use('/api/users', createProxyMiddleware({
    target: 'http://localhost:3006',
    changeOrigin: true,
    pathRewrite: { '^/api/users': '/users' },
  }));
};
