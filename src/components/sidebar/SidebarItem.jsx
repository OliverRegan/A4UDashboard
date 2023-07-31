import React, { useEffect } from 'react'

const SidebarItem = props => {
    console.log()

    return (
        <div className="sidebar__item">
            <div className={'sidebar__item-inner ' + (props.active ? "text-blue-400" : "") + "  hover:text-blue-500"}>
                <i className={props.icon}></i>
                <span className=''>
                    {props.title}
                </span>
            </div>
        </div>
    )
}

export default SidebarItem
