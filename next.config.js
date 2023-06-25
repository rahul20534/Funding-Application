module.exports = {
  env: {
    MONGO_URI: process.env.MONGO_URI,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "my-fundingapplication-uss.s3.ap-south-1.amazonaws.com"
      }
    ],
  },
};

