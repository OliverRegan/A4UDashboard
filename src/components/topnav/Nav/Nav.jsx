import { useEffect, useState, useRef } from 'react'

import NavItem from './NavItem/NavItem'
import { Link, useLocation } from 'react-router-dom'
import { MenuTwoTone } from '@mui/icons-material';
import {
    Drawer,
    Button,
    Box,
    IconButton
} from '@mui/material';

import sidebar_items from '../../../assets/JsonData/sidebar_routes.json'
import Loader from '../../utility/Loader/Loader'

import './nav.css'
import { FaChevronDown } from 'react-icons/fa'

const Nav = () => {
    const [showDrawer, setShowDrawer] = useState(false);

    const [activeItem, setActiveItem] = useState()
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation();

    const dropdown_toggle_el = useRef(null)
    const dropdown_content_el = useRef(null)

    document.addEventListener('mousedown', (e) => {
        // user click toggle
        if (dropdown_toggle_el.current && dropdown_toggle_el.current.contains(e.target)) {

        } else {
            // user click outside toggle and content
            if (dropdown_content_el.current && !dropdown_content_el.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
    })
    useEffect(() => {
        console.log(location.pathname)
        sidebar_items.forEach(item => {
            if (location.pathname.includes(item.route)) {
                setActiveItem(() => item)
                console.log(item)
            }
        })
    }, [location])

    const toggleDrawer = (open) =>
        (event) => {
            if (
                event.type === 'keydown' &&
                ((event).key === 'Tab' ||
                    (event).key === 'Shift')
            ) {
                return;
            }
            setShowDrawer(open)
        };

    return (
        <div className='w-[20rem] '>
            <div className="m-2">
                <IconButton
                    onClick={toggleDrawer(true)}
                    aria-label="Open to show sidebar"
                    title="Open to show sidebar"
                >
                    <MenuTwoTone />
                </IconButton>
            </div>
            <Drawer
                anchor={'left'}
                open={showDrawer}
                onClose={toggleDrawer(false)}
            >

                <div className="h-[40%] my-auto flex flex-col justify-around">
                    {
                        activeItem === undefined ?
                            <Loader />
                            :
                            sidebar_items.map((item) => (
                                <div className="w-5/6 mx-auto">
                                    <Link
                                        className={`${(activeItem === item ? "text-blue-400" : "")} +   hover:text-blue-500 text-xl`}
                                        to={item.route}

                                        onClick={() => {
                                            setActiveItem(item)
                                            setShowDrawer(() => false)
                                        }}
                                    >
                                        <div className="flex">
                                            <div className="">
                                                <i className={item.icon}></i>
                                            </div>
                                            <div>
                                                <span className='pl-3'>
                                                    {item.display_name}
                                                </span>
                                            </div>
                                        </div>


                                    </Link>
                                </div>
                            ))
                    }
                </div>
            </Drawer>
        </div>
    )
}
export default Nav;