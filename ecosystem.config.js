module.exports = {
    apps: [{
        name: "apitest",
        script: "./bin/www",
        watch: true,
        env: {
            "NODE_ENV": "development",
            "DB_CONFIG": "dev"
        },
        env_production: {
            "NODE_ENV": "production",
            "DB_CONFIG": "prod"
        }
    }]
};
