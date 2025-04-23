// __mocks__/env-nextjs.js
module.exports = {
    createEnv: () => ({
      AUTH_SECRET: "mock-secret",
      GOOGLE_CLIENT_ID: "mock-google-id",
      GOOGLE_CLIENT_SECRET: "mock-google-secret",
      GITHUB_OAUTH_TOKEN: "mock-github-token",
      DATABASE_URL: "mock-db-url",
      RESEND_API_KEY: "mock-resend-key",
    }),
  };
  