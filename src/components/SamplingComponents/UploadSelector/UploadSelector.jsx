import { useEffect } from "react"
import { GetCookie } from "../../utility/Cookies/SetGetCookie"

const UploadSelector = ({ setUploadType, uploadType }) => {

    useEffect(() => {
        // Check Xero cookie
        let xeroCookie = GetCookie("XeroAuth")
    }, [])

    return (
        <div>
            {
                uploadType != "" ?
                    <div className="flex flex-col w-3/4 mx-auto">
                        <div className="bg-white m-2 overflow-hidden group">
                            <button className="bg-white p-4 w-full flex" onClick={() => setUploadType(() => "")}>
                                <div className="flex-1 text-xl">
                                    Select another upload method
                                </div>
                            </button>
                            <div className="w-full h-1 rounded bg-blue-300 group-hover:bg-blue-500  transition-all delay-50"></div>
                        </div>
                    </div>
                    :
                    <div className="flex flex-col w-3/4 mx-auto">
                        <div className="bg-white m-2 overflow-hidden group">
                            <button className="bg-white p-4 w-full flex" onClick={() => setUploadType(() => "file")}>
                                <div className="flex-2">
                                    insert image here
                                </div>
                                <div className="flex-1">
                                    File
                                </div>
                            </button>
                            <div className="w-full h-1 rounded bg-blue-300 group-hover:bg-blue-500  transition-all delay-50"></div>
                        </div>
                        <div className="bg-white m-2 overflow-hidden group">
                            <button className="bg-white p-4 w-full flex" onClick={() => setUploadType(() => "xero")}>
                                <div className="flex-2">
                                    insert image here
                                </div>
                                <div className="flex-1">
                                    Xero
                                </div>
                            </button>
                            <div className="w-full h-1 rounded bg-blue-300 group-hover:bg-blue-500  transition-all delay-50"></div>
                        </div>
                    </div>
            }
        </div>

    )

}
export default UploadSelector