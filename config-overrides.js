const webpack = require('webpack');

module.exports = {
    webpack: (config, env) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            "buffer": require.resolve("buffer/"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "util": require.resolve("util/"),
            "process": require.resolve("process/browser"),
            "vm": require.resolve("vm-browserify"),
        };
        config.plugins.push(
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser',
            })
        );
        return config;
    },
};
