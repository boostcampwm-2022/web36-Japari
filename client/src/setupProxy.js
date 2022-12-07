const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: {
        protocol: "https:",
        host: "localhost",
        port: 4000,
      },
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
      secure: false,
    })
  );
};
