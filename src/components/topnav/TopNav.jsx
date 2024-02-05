import React, { useEffect, useState } from 'react'

import './topnav.css'

import { Link } from 'react-router-dom'

import Dropdown from '../dropdown/Dropdown'

import ThemeMenu from '../thememenu/ThemeMenu'

import notifications from '../../assets/JsonData/notification.json'

import user_image from '../../assets/images/profile.png'

import user_menu from '../../assets/JsonData/user_menus.json'

import { useMsal } from '@azure/msal-react'
import axios from 'axios'
import useGetToken from '../utility/Auth/useGetToken'
import Nav from './Nav/Nav'

const curr_user = {
    display_name: 'Cool Auditor',
    image: user_image
}

const renderNotificationItem = (item, index) => (
    <div className="notification-item" key={index}>
        <i className={item.icon}></i>
        <span>{item.content}</span>
    </div>
)
{/*
const renderUserToggle = (user) => (
    <div className="topnav__right-user">
        <div className="topnav__right-user__image">
            <img src={user.image} alt="" />
        </div>
        <div className="topnav__right-user__name">
            {user.display_name}
        </div>
</div>
)*/}

const renderUserMenu = (item, index) => (
    <Link to='/dashboard' key={index}>
        <div className="notification-item">
            <i className={item.icon}></i>
            <span>{item.content}</span>
        </div>
    </Link>
)

const Topnav = () => {

    const { instance } = useMsal()
    const profile = instance.getActiveAccount()
    const getToken = useGetToken(instance);


    return (
        <div className='topnav sticky top-0 w-screen'>
            <div className='grid grid-cols-12 h-[100%] '>
                <div className='col-span-4 text-[var(--txt-white)] flex flex-col justify-center'>
                    <p className='text-3xl ml-5'>
                        Auditing 4 You
                    </p>
                </div>
                <div className='col-span-4'>
                    {/* Spacer */}
                </div>
                <div className="col-span-4 flex justify-end">
                    <div className='flex flex-col justify-center w-[100%]'>
                        <div className='w-100 flex'>
                            <div className='w-1/2 text-[var(--txt-white)] flex flex-col justify-end'>
                                {/* <div className="topnav__right-user__image">
                                <img src={user.image} alt="" />
                            </div> */}
                                <div className="text-xl">
                                    {profile.name}
                                </div>

                            </div>
                            <div className='w-1/2 flex justify-around '>

                                <Dropdown
                                    icon='bx bx-bell text-[var(--txt-white)]'
                                    badge='5' //amount of notifications
                                    contentData={notifications}
                                    renderItems={(item, index) => renderNotificationItem(item, index)}
                                    renderFooter={() => <Link to='/'>See all</Link>}
                                />


                                {/* <ThemeMenu /> */}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className='flex'>
                <Nav />

            </div>


            {/*<div className="topnav__search">
                <input type="text" placeholder='Search by name...' />
                <i className='bx bx-search'></i>
            </div>*/}
            {/* <div className="topnav__right menu14">
                <div className="topnav__right-item">

                    <Dropdown
                        customToggle={() => renderUserToggle(curr_user)}
                        contentData={user_menu}
                        renderItems={(item, index) => renderUserMenu(item, index)}
                    />
                </div>

            </div> */}
        </div>
    )
}

export default Topnav
