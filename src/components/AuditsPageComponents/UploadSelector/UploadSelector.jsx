import { useEffect } from "react"
import { GetCookie } from "../../utility/Cookies/SetGetCookie"

import xeroLogo from "../../../assets/images/Xero/XeroLogo.png"
import PageHeader from "../../layout/PageHeader/PageHeader"
import { Folder, FolderOutlined } from "@mui/icons-material"

const UploadSelector = ({ setUploadType, uploadType, setDataImported, dataImported }) => {

    useEffect(() => {
        // Check Xero cookie
        let xeroCookie = GetCookie("XeroAuth")
    }, [])

    return (
        <div className="">
            {
                uploadType != "" ?
                    <div className=" my-8">
                        <div className="bg-white">
                            <div className={"hover:bg-red-300  hover:text-white hover:cursor-pointer max-w-100 rounded-md"}
                                onClick={() => setUploadType(() => "")}
                            >

                                <h2 className="text-lg p-2">
                                    Or select another upload method
                                </h2>

                            </div>
                        </div>
                    </div>
                    :
                    <div className="flex flex-col my-8">
                        <h4 className="text-lg">Please select a datasource:</h4>
                        <div className="bg-white my-2">
                            <div>
                                <div className={"  row min-h-10"}
                                    onClick={() => {
                                        setDataImported(() => false)
                                        setUploadType(() => "file")
                                    }}
                                >
                                    <div className="col-2  flex flex-col justify-center">
                                        <div className="flex justify-center">
                                            <FolderOutlined sx={{
                                                fontSize: "2.5rem"
                                            }} />
                                        </div>
                                    </div>
                                    <div className="col-10 hover:bg-blue-400  hover:text-white hover:cursor-pointer rounded-md flex flex-col justify-center">
                                        <h2 className="text-lg -2">
                                            File Upload
                                        </h2>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white my-2">
                            <div>
                                <div className={" row min-h-10"}
                                    onClick={() => {
                                        setDataImported(() => false)
                                        setUploadType(() => "xero")
                                    }}
                                >
                                    <div className="col-2 flex flex-col justify-center">
                                        <div className="flex justify-center">
                                            <img src={xeroLogo} className="max-w-full max-h-10" />
                                        </div>

                                    </div>
                                    <div className="col-10 hover:bg-blue-400  hover:text-white hover:cursor-pointer rounded-md flex flex-col justify-center">
                                        <h2 className="text-lg -2">
                                            Xero
                                        </h2>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
            }
        </div>

    )

}
export default UploadSelector