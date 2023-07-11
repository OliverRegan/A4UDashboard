export const IDENTITY_CONFIG_OIDC = {

    authority: process.env.REACT_APP_OIDC_URL,
    clientId: process.env.REACT_APP_CLIENT_ID,
    responseType: 'code',

    // Dev
    redirectUri: "http://localhost:3000",

    // Prod
    // redirectUri: "https://auditing4you.com/dashboard",

    automaticSilentRenew: true
}