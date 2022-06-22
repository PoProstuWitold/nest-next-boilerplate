/** @type {import('next').NextConfig} */
module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  reactStrictMode: true,
  images: {
    domains: ['www.gravatar.com', 'lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com'],
  }
}
