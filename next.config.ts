module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Any request to /api/* is forwarded to the backend
        destination: "https://back-end.com.ge/api/:path*",
      },
    ];
  },
};