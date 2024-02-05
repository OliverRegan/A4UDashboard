import { Link } from "react-router-dom"

const NavItem = (props) => {
    return (
        <div className="w-5/6 mx-auto">
            <Link
                className={`${(props.isActive ? "text-blue-400" : "")} +   hover:text-blue-500 text-xl`}
                to={props.item.route}
                onClick={() => {
                    props.setActiveItem(props.item)
                    props.toggleDrawer(false)
                }}
            >
                <div className="flex">
                    <div className="">
                        <i className={props.item.icon}></i>
                    </div>
                    <div>
                        <span className='pl-3'>
                            {props.item.display_name}
                        </span>
                    </div>
                </div>


            </Link>
        </div>
    )
}

export default NavItem