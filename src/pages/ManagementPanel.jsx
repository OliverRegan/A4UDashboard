import { useEffect } from "react"
import { Link, Outlet } from "react-router-dom"


const ManagementPanel = () => {


    useEffect(() => {


    }, [])


    return (
        <div>
            <div className="grid grid-cols-10 justify-around bg-gray-100 rounded shadow h-10">
                <Link to="/management" className="col-span-2 flex">
                    <div className="text-center w-full h-full flex flex-col justify-center">
                        Home
                    </div>
                </Link>
                <Link to="/management/subscriptions" className="col-span-2 flex">
                    <div className="text-center w-full h-full flex flex-col justify-center">
                        Subscriptions
                    </div>
                </Link>
                <Link to="/management/customer_details" className="col-span-2 flex">
                    <div className="text-center w-full h-full flex flex-col justify-center">
                        Customer Details
                    </div>
                </Link>
                <Link to="/management/invoices" className="col-span-2 flex">
                    <div className="text-center w-full h-full flex flex-col justify-center">
                        Invoices
                    </div>
                </Link>
                <Link to="/management/purchasing" className="col-span-2 flex">
                    <div className="text-center w-full h-full flex flex-col justify-center">
                        Purchasing
                    </div>
                </Link>
            </div>
            <div className="mt-5">
                <Outlet />
            </div>
        </div>
    )
}
export default ManagementPanel