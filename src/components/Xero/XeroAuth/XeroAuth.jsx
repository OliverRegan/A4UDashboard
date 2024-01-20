import { Link, useLocation, useNavigate, } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SetCookie, GetCookie } from "../../utility/Cookies/SetGetCookie";
import Loader from "../../utility/Loader/Loader"

const XeroAuth = (props) => {

    const [accessToken, setAccessToken] = useState('');
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const navigate = useNavigate();


    useEffect(() => {

        if (params.has("code")) { // Look for code from Xero
            handleCallback().then(() => {
                navigate(props.redirectPath)
            })
        }
        else {
            // Check for cookie and its expiry
            let cookie = JSON.parse(GetCookie("XeroAuth"))

            console.log(cookie)

            if (new Date(cookie.expires_at) < new Date()) {
                // refresh & re save
                console.log("hello")
            } else {
                console.log("hello no")
                // try use refresh, if not login
                loginWithXero();
            }
        }

    }, [])

    const xeroConfig = {
        clientId: process.env.REACT_APP_XERO_CLIENT_ID,
        clientSecret: process.env.REACT_APP_XERO_SECRET,
        authorizationUrl: 'https://login.xero.com/identity/connect/authorize',
        tokenUrl: 'https://identity.xero.com/connect/token',
        redirectUri: process.env.REACT_APP_XERO_REDIRECT_URL,
        scopes: 'openid profile email accounting.settings accounting.journals.read accounting.attachments accounting.transactions offline_access',
    };

    function loginWithXero() {

        const authUrl = `${xeroConfig.authorizationUrl}?response_type=code&client_id=${xeroConfig.clientId}&redirect_uri=${xeroConfig.redirectUri}&scope=${xeroConfig.scopes}&prompt=select_account`;
        window.location.href = authUrl;
    }

    // Function to handle callback after successful Xero authorization
    const handleCallback = async () => {
        try {
            const code = params.get('code');
            if (code) {
                const credentials = `${xeroConfig.clientId}:${xeroConfig.clientSecret}`;
                const base64EncodedCredentials = btoa(credentials);

                let queryParams = new URLSearchParams();
                queryParams.append("grant_type", "authorization_code");
                queryParams.append("code", code);
                queryParams.append("redirect_uri", xeroConfig.redirectUri);

                await axios.post(xeroConfig.tokenUrl,
                    queryParams,
                    {
                        headers: {
                            "Authorization": `Basic ${base64EncodedCredentials}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        }
                    },
                ).then((res) => {
                    console.log(res)
                    setAccessToken(res.data.access_token); // Set access token in state

                    // Encrypt and set cookie - later
                    // let encrypted = basicEncrypt(JSON.stringify(res.data))

                    let encrypted = JSON.stringify(res.data); // TEMP
                    SetCookie("XeroAuth", encrypted, 0.25);
                    console.log(res.data)
                    if (params.get("xeroAuthRedirect") == "true") {
                        console.log("test")
                        props.setAuthorised(() => true)
                    }
                });

            } else {
                console.error('Authorization code not found in URL');
            }
        } catch (error) {
            console.error('Error fetching access token:', error);
        }
    };



    return (
        <div className="h-full w-full flex flex-col justify-center text-center">
            {/* <Button
                variant="contained"
                onClick={() => loginWithXero()}>
                Import Xero Shit
            </Button> */}
            <p className="my-5">Starting Authentication Flow</p>
            <Loader />
        </div>
    )

}

export default XeroAuth