import React, { useEffect, useState } from 'react'

import './layout.css'

import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
import Routes from '../Routes'

import { BrowserRouter, Route } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import ThemeAction from '../../redux/actions/ThemeAction'
import { useMsalAuthentication, useMsal, useIsAuthenticated } from '@azure/msal-react'
import { InteractionType, InteractionStatus } from '@azure/msal-browser'
import Authenticating from '../../pages/Authenticating'
import ResultProvider from '../utility/Auth/ResultContext'

const Layout = (props) => {


    const { instance, inProgress } = useMsal();

    const isAuthenticated = useIsAuthenticated();

    const themeReducer = useSelector(state => state.ThemeReducer)

    const dispatch = useDispatch()


    useEffect(() => {
        const themeClass = localStorage.getItem('themeMode', 'theme-mode-light')

        const colorClass = localStorage.getItem('colorMode', 'theme-mode-light')

        dispatch(ThemeAction.setMode(themeClass))

        dispatch(ThemeAction.setColor(colorClass))
    }, [dispatch])

    return (

        <BrowserRouter>
            <ResultProvider>
                {isAuthenticated && inProgress == InteractionStatus.None ?
                    <Route render={(props) => (
                        <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                            <Sidebar {...props} />
                            <div className="layout__content">
                                <TopNav />
                                {/* <div className="layout__content-main"> */}
                                <div className='mx-5'>
                                    <Routes />
                                </div>
                            </div>
                        </div>
                    )} />
                    :
                    <Authenticating />
                }
            </ResultProvider>
        </BrowserRouter>

    )
}

export default Layout
