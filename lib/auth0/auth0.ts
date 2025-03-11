import { Auth0Client } from "@auth0/nextjs-auth0/server";

// this part is a bit confusing, you need to setup your own custom API in auth0 and use the audience value from that API
export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: "openid profile email offline_access",
    audience: "http://localhost:3000",
  },
});
