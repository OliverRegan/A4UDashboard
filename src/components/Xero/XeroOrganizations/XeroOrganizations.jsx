import { useEffect } from "react"

const XeroOrganizations = (props) => {

    useEffect(() => {
        console.log(props)
    }, [])

    return (
        <div className="mt-8 ">
            <h2 className="text-2xl mb-8">
                Xero
            </h2>
            <h4 className="">Please confirm which organization you'd like to use</h4>
            <div className="mt-10 mb-3">
                {
                    props.connections.map((connection) => {
                        return (
                            <div>
                                <div className={"border-t-0  hover:bg-blue-400  hover:text-white hover:cursor-pointer "
                                    + (props.connections.indexOf(connection) === 0 ? " rounded-t-md" : "") + (props.connections.indexOf(connection) === (props.connections.length - 1) ? " rounded-b-md" : "")}
                                    onClick={() => props.setSelectedConnection(connection)}
                                >
                                    <div className="p-4">
                                        {connection.name}
                                    </div>
                                </div>
                            </div>


                        )
                    })
                }
            </div>
        </div>
    )

}

export default XeroOrganizations