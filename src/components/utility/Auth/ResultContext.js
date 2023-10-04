import React, { createContext } from "react";
import { loginRequest } from '../../../authConfig'
import { useMsalAuthentication } from "@azure/msal-react";
import { InteractionType } from '@azure/msal-browser'


export const ResultContext = createContext();

const ResultProvider = ({ children }) => {

    const { result, error } = useMsalAuthentication(InteractionType.Redirect, loginRequest)

    return (
        <ResultContext.Provider value={[result, error]}>
            {children}
        </ResultContext.Provider>
    )

}

export default ResultProvider;