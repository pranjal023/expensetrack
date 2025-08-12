module.exports = {
  apps: [
    {
      name: "expense-tracker",
      script: "./backend/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        DB_HOST: "your-rds-endpoint.amazonaws.com",
        DB_USER: "your-db-username",
        DB_PASSWORD: "your-db-password",
        DB_NAME: "expense_tracker",
        SENDINBLUE_API_KEY: "your-sendinblue-api-key",
        CASHFREE_APP_ID: "your-cashfree-app-id",
        CASHFREE_SECRET_KEY: "your-cashfree-secret-key",
        CASHFREE_ENV: "sandbox"
      }
    }
  ]
}
