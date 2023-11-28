import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "../../../authConfig";


const useGetToken = (instance) => {
    const getToken = async () => {
        let accessToken
        const accessTokenRequest = loginRequest;
        console.log(loginRequest)
        await instance
            .acquireTokenSilent(accessTokenRequest)
            .then((accessTokenResponse) => {
                // Acquire token silent success
                accessToken = accessTokenResponse.accessToken;
            }).catch((error) => {
                console.log(error)
                if (error instanceof InteractionRequiredAuthError) {
                    instance
                        .acquireTokenRedirect(accessTokenRequest)
                        .then(function (accessTokenResponse) {
                            // Acquire token interactive success
                            accessToken = accessTokenResponse.accessToken;
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            })
        return accessToken
    }
    return getToken();
}

export default useGetToken