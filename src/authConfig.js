export const msalConfig = {

    auth: {
        clientId: process.env.REACT_APP_CLIENT_ID,
        authority: process.env.REACT_APP_OIDC_URL,
        redirectUri: process.env.REACT_APP_OIDC_REDIRECT_URI,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    }

};

export const protectedResources = {
    api: {
        endpoint: process.env.REACT_APP_BACKEND_URL,
        scopes: {
            read: [process.env.REACT_APP_OIDC_SCOPE],
            write: [process.env.REACT_APP_OIDC_SCOPE],
        },
    }
}

export const loginRequest = {
    scopes: [process.env.REACT_APP_OIDC_SCOPE]
}