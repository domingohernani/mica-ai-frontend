import * as auth0 from "auth0-js";

const domain = import.meta.env["VITE_AUTH0_DOMAIN"];
const clientID = import.meta.env["VITE_AUTH0_CLIENT_ID"];
const redirectUri = import.meta.env["VITE_AUTH0_REDIRECT_URI"];

const webAuth = new auth0.WebAuth({
  domain,
  clientID,
  redirectUri,
  scope: "openid profile email offline_access",
  audience: import.meta.env["VITE_AUTH0_AUDIENCE"],
  responseType: "token",
});

export default webAuth;
