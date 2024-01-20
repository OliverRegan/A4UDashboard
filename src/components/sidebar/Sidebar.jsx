import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './sidebar.css'
import logo from '../../assets/images/logo.png'
import sidebar_items from '../../assets/JsonData/sidebar_routes.json'
import user_image from '../../assets/images/profile.png'
import SidebarItem from './SidebarItem'
import { MsalProvider, useMsal } from '@azure/msal-react'
// import { useAuth } from 'oidc-react'

const user = {
    display_name: 'Matthew Harris',
    title: 'Auditor',
    image: user_image
}

const Sidebar = props => {


    const [activeItem, setActiveItem] = useState(0)

    const { instance } = useMsal()
    const profile = instance.getActiveAccount()


    return (
        <div className='sidebar'>
            <div className="sidebar__logo">
                <img src={logo} alt="auditing 4 you" />
            </div><br /><br /><br />

            <div className="topnav__right-user icon14">
                <div className="topnav__right-user__image">
                    <img src={user.image} alt="" />
                </div>
                <div className="topnav__right title69">
                    {profile.name}
                </div><br />

            </div>
            <div className="topnav__right title14">
                {user.title}
            </div><br /><br />
            {
                sidebar_items.map((item, index) => (
                    <Link to={item.route} key={index}
                    >
                        <SidebarItem
                            title={item.display_name}
                            activeItem={activeItem}
                            setActiveItem={setActiveItem}
                            itemNum={sidebar_items.indexOf(item)}
                            icon={item.icon}
                        />
                    </Link>
                ))
            }
        </div>
    )
}

export default Sidebar
