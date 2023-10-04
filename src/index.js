import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals'

import { configureStore } from '@reduxjs/toolkit'
import ThemeReducer from "./redux/reducers/ThemeReducer"
import SaveSample from "./redux/reducers/SaveSample"
import SeedCode from "./redux/reducers/SeedCode"
import SaveAudit from './redux/reducers/SaveAudit';
import { Provider } from 'react-redux'
import './assets/boxicons-2.0.7/css/boxicons.min.css'
import './assets/css/grid.css'
import './assets/css/theme.css'
import './index.css'
import "bear-react-datepicker/dist/index.css";
import {
  createTheme,
  PaletteColorOptions,
  ThemeProvider,
} from '@mui/material/styles';
import Layout from './components/layout/Layout'
// OIDC config
import { AuthProvider, UserManager } from "oidc-react";
import { OidcClient } from "oidc-client";
import { IDENTITY_CONFIG_OIDC } from './components/utility/Auth/OIDC-config';
import { loginRequest, msalConfig } from './authConfig';
import { EventType, InteractionRequiredAuthError, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider, useIsAuthenticated, useMsal } from '@azure/msal-react';

// Redux
const store = configureStore({
  reducer: {
    ThemeReducer: ThemeReducer,
    SaveSample: SaveSample,
    SeedCode: SeedCode,
    SaveAudit: SaveAudit
  },
})

// Authentication
const pca = new PublicClientApplication(msalConfig)

pca.addEventCallback((event) => {
  if (
    (
      event.eventType === EventType.LOGIN_SUCCESS ||
      event.eventType === EventType.ACQUIRE_TOKEN_BY_CODE_SUCCESS ||
      event.eventType === EventType.SSO_SILENT_SUCCESS
    ) && event.payload.account
  ) {
    pca.setActiveAccount(event.payload.account)
  }
});


const AuthContainer = () => {

  const { instance, inProgress } = useMsal();

  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated && !inProgress) {
      instance.ssoSilent(loginRequest)
        .then((response) => {
          instance.setActiveAccount(response.account);
        })
        .catch((error) => {
          console.log(error)
          if (error instanceof InteractionRequiredAuthError) {
            instance.loginRedirect(loginRequest)
          }
        })
    }
  }, [instance, inProgress, isAuthenticated])

  return <Layout />
}

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <MsalProvider instance={pca}>
        <AuthContainer />
      </MsalProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
