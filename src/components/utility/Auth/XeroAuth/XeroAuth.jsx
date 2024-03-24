import { useLocation, useNavigate, } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SetCookie, GetCookie } from "../../Cookies/SetGetCookie";
import Loader from "../../Loader/Loader"
import { setAudit } from "../../../../redux/reducers/SaveAudit";
import { useDispatch, useSelector } from "react-redux";

function generateRandomString(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
}

// Function to generate a SHA-256 hash
async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

// Function to encode in Base64URL
function base64URLEncode(str) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// Main function to generate code verifier and code challenge
async function generateCodeChallenge() {
    const codeVerifier = "blKBUvD-JmA6r24w6k6ex~CW9LDl8..c2cEQxeyZQPotyjWEVj_0td.R0w9t15In-Yy5-y-mlyGy_LzUyuBvnJLUUxv4T2jslWl2NExm5dHV4AjHqUDEq0fPW2tI3vrq"
    console.log(codeVerifier)
    const hashedVerifier = await sha256(codeVerifier); // Generate SHA-256 hash
    const asciiCodeVerifier = Array.from(hashedVerifier, c => c.charCodeAt(0)).join(","); // Convert to ASCII
    const codeChallenge = base64URLEncode(asciiCodeVerifier); // Encode hash in Base64URL format
    console.log(codeChallenge)
    return { verifier: codeVerifier, challenge: codeChallenge };
}

const XeroAuth = (props) => {

    const audit = useSelector((state) => state.SaveAudit)
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                console.log("Refreshing Token")
            } else {
                console.log("Not authenticated, logging in.")
                // try use refresh, if not login
                loginWithXero();
            }
        }

    }, [])


    const xeroConfig = {
        clientId: process.env.REACT_APP_XERO_CLIENT_ID,
        clientSecret: process.env.REACT_APP_XERO_SECRET,
        authorizationUrl: process.env.REACT_APP_XERO_AUTH_URL,
        tokenUrl: process.env.REACT_APP_XERO_TOKEN_URL,
        redirectUri: process.env.REACT_APP_XERO_REDIRECT_URL,
        scopes: process.env.REACT_APP_XERO_SCOPES,
    };

    async function loginWithXero() {
        const authUrl = `${xeroConfig.authorizationUrl}?response_type=code&client_id=${xeroConfig.clientId}&redirect_uri=${xeroConfig.redirectUri}&scope=${xeroConfig.scopes}&prompt=select_account`
        window.location.href = authUrl;
    }

    // Function to handle callback after successful Xero authorization
    const handleCallback = async () => {
        try {
            const code = params.get('code');
            if (code) {
                const credentials = `${xeroConfig.clientId}:${xeroConfig.clientSecret}`;
                const base64EncodedCredentials = btoa(credentials);
                // const { verifier, challenge } = await generateCodeChallenge()
                // let queryParams = new URLSearchParams();
                let queryParams = new FormData();
                queryParams.append("grant_type", "authorization_code");
                queryParams.append("client_id", xeroConfig.clientId);
                queryParams.append("code", code);
                queryParams.append("redirect_uri", xeroConfig.redirectUri);



                await axios.post(xeroConfig.tokenUrl,
                    queryParams,
                    {
                        headers: {
                            'Authorization': `Basic ${base64EncodedCredentials}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        }
                    },
                ).then(res => {
                    console.log(res)
                    const date = new Date().getTime()
                    const xeroAuthData = {
                        "expiry_timestamp": date + (res.data.expires_in * 1000), // convert s to ms
                        ...res.data
                    }
                    // Encrypt and set cookie - later
                    // let encrypted = basicEncrypt(JSON.stringify(res.data))

                    let encrypted = JSON.stringify(xeroAuthData); // TEMP
                    SetCookie("XeroAuth", encrypted, 0.25);
                    if (params.get("xeroAuthRedirect") == "true") {
                        console.log("test")
                        props.setAuthorised(() => true)
                        dispatch(setAudit([
                            audit.importData, "xero", audit.accounts, audit.auditDetails]))
                    }
                });
                // })


            } else {
                console.error('Authorization code not found in URL');
            }
        } catch (error) {
            console.error('Error fetching access token:', error);
        }
    };



    return (
        <div className="my-8">
            {/* <Button
                variant="contained"
                onClick={() => loginWithXero()}>
                Import Xero Shit
            </Button> */}
            <Loader />
        </div>
    )

}

export default XeroAuth