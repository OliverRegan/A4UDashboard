import React from 'react'
import { Link } from 'react-router-dom'
import './sidebar.css'
import logo from '../../assets/images/logo.png'
import sidebar_items from '../../assets/JsonData/sidebar_routes.json'
import user_image from '../../assets/images/profile.png'
import Dropdown from '../dropdown/Dropdown'
import ThemeMenu from '../thememenu/ThemeMenu'
import notifications from '../../assets/JsonData/notification.json'
import user_menu from '../../assets/JsonData/user_menus.json'

const user = {
    display_name: 'Matthew Harris',
    title: 'Cool Auditor',
    image: user_image
}

const SidebarItem = props => {

    const active = props.active ? 'active' : ''
    console.log(props)
    return (
        <div className="sidebar__item">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>
                    {props.title}
                </span>
            </div>
        </div>
    )
}

const Sidebar = props => {


    const activeItem = sidebar_items.findIndex(item => item.route === props.location.pathname)

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
                    {user.display_name}
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
                            icon={item.icon}
                            active={index === activeItem}
                        />
                    </Link>
                ))
            }
        </div>
    )
}

export default Sidebar
