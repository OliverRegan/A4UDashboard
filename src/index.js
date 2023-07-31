import React from 'react';
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
// OIDC config
import { AuthProvider, UserManager } from "oidc-react";
import { OidcClient } from "oidc-client";

import { IDENTITY_CONFIG_OIDC } from './components/utility/Auth/OIDC-config';

import Layout from './components/layout/Layout'

const store = configureStore({
  reducer: {
    ThemeReducer: ThemeReducer,
    SaveSample: SaveSample,
    SeedCode: SeedCode,
    SaveAudit: SaveAudit
  },
})
const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const theme = createTheme({
  palette: {
    anger: createColor('#F40B27'),
    apple: createColor('#5DBA40'),
    steelBlue: createColor('#5C76B7'),
    violet: createColor('#BC00A3'),
  },
});
document.title = 'Admin'

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <AuthProvider {...IDENTITY_CONFIG_OIDC} onSigninRedirectCallback={UserManager.onSigninRedirectCallback}>
        <Layout />
      </AuthProvider >
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
