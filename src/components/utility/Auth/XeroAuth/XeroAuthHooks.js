import axios from "axios";
import { SetCookie } from "../../Cookies/SetGetCookie";


export const ValidateXeroAuth = async (xeroCookie) => {

    const xeroAuthCookie = JSON.parse(xeroCookie);
    console.log(xeroAuthCookie)
    console.log(new Date().getTime())

    // Check Expiry
    if (!xeroAuthCookie.expiry_timestamp > new Date().getTime()) {
        // Valid token
        return xeroAuthCookie.access_token
    } else {

        // Try and refresh token
        // Add this in here later
        console.log("Can't get token at the moment, refreshing")
        const xeroRefreshConfig = {
            clientId: process.env.REACT_APP_XERO_CLIENT_ID,
            clientSecret: process.env.REACT_APP_XERO_SECRET,
            token_url: process.env.REACT_APP_XERO_TOKEN_URL,
            grant_type: 'refresh_token',
            refresh_token: xeroAuthCookie.refresh_token
        }

        const credentials = `${xeroRefreshConfig.clientId}:${xeroRefreshConfig.clientSecret}`;
        const base64EncodedCredentials = btoa(credentials);
        let queryParams = new FormData();
        queryParams.append("grant_type", xeroRefreshConfig.grant_type);
        queryParams.append("refresh_token", xeroRefreshConfig.refresh_token);
        console.log(xeroRefreshConfig)
        console.log(base64EncodedCredentials)
        return await axios.post(xeroRefreshConfig.token_url,
            queryParams,
            {
                headers: {
                    'Authorization': `Basic ${base64EncodedCredentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            },
        ).then(res => {
            console.log(res)
            const xeroAuthData = {
                "expiry_timestamp": new Date().getTime() + res.data.expires_in,
                ...res.data
            }
            // Encrypt and set cookie - later
            // let encrypted = basicEncrypt(JSON.stringify(res.data))

            let encrypted = JSON.stringify(xeroAuthData); // TEMP
            SetCookie("XeroAuth", encrypted, 60); // 60 days because of refresh token
            return xeroAuthData.access_token;
        })
    }



}


// Pull all the auth config out of xeroAuth component and move it here