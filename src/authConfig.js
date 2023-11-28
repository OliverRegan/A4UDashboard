
import { Logger, LogLevel } from "@azure/msal-browser";

export const msalConfig = {

    auth: {
        clientId: process.env.REACT_APP_CLIENT_ID,
        authority: process.env.REACT_APP_OIDC_URL,
        redirectUri: process.env.REACT_APP_OIDC_REDIRECT_URI,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            logLevel: LogLevel.Error,
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            },
            piiLoggingEnabled: false
        },
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