module.exports = {
    devServer: {
        proxy: {
            '/user': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: { '^/user': '' }
            }
        }
    }
}
