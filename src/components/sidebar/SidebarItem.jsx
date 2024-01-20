import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SidebarItem = props => {



    return (
        <div className="sidebar__item">
            <div className={'sidebar__item-inner ' + (props.activeItem == props.itemNum ? "text-blue-400" : "") + "  hover:text-blue-500"}>
                <i className={props.icon}></i>
                <span className=''>
                    {props.title}
                </span>
            </div>
        </div>
    )
}

export default SidebarItem
