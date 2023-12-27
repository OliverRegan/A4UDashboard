import { Button } from "@mui/material"
import { Link, useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SetCookie, GetCookie } from "../../utility/Cookies/SetGetCookie";


const XeroToken = () => {

    const [accessToken, setAccessToken] = useState('');
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const navigate = useNavigate();


    useEffect(() => {
        console.log(params)
        console.log(GetCookie("XeroAuth"))
        if (params) { // Look for code from Xero
            handleCallback();
        }

    }, [])

    const xeroConfig = {
        clientId: process.env.REACT_APP_XERO_CLIENT_ID,
        clientSecret: process.env.REACT_APP_XERO_SECRET,
        authorizationUrl: 'https://login.xero.com/identity/connect/authorize',
        tokenUrl: 'https://identity.xero.com/connect/token',
        redirectUri: process.env.REACT_APP_XERO_REDIRECT_URL,
        scopes: 'openid profile email accounting.settings.read',
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

                let params = new URLSearchParams();
                params.append("grant_type", "authorization_code");
                params.append("code", code);
                params.append("redirect_uri", xeroConfig.redirectUri);

                await axios.post(xeroConfig.tokenUrl,
                    params,
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

                });

            } else {
                console.error('Authorization code not found in URL');
            }
        } catch (error) {
            console.error('Error fetching access token:', error);
        }
    };



    return (
        <div>

            <Button onClick={() => loginWithXero()}>
                Import Xero Shit
            </Button>
        </div>
    )

}

export default XeroToken