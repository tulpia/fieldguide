const withSass = require('@zeit/next-sass')

module.exports = withSass({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  }
})