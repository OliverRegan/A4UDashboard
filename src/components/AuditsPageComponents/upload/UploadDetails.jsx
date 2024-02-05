import { Button } from "@mui/material";
import { useEffect, useState } from "react";

const UploadDetails = ({ audit, formatBytes, handleImportRemoval }) => {

    const [detailsType, setDetailsType] = useState("")

    useEffect(() => {
        if (audit.importData.file.fileName != "" && audit.importData.file.fileSize != "") {
            setDetailsType("file");
        } else if (audit.importData.xero.connection.name != "" && audit.importData.xero.connection.id != "") {
            setDetailsType("xero");
        }
    }, [audit])

    return (


        <>
            {
                detailsType === "file" ?
                    <div>
                        <div className='flex flex-col justify-around mx-auto'>
                            <div className=' mb-8 mt-8 flex'>
                                <h2 className='text-xl'>File Name:</h2>
                                <div className="flex flex-col justify-center ml-5">
                                    <p className="text-lg">{audit.importData.file.fileName}</p>
                                </div>
                            </div>
                            <div className=' mb-8 mt-8 flex'>
                                <h2 className='text-xl'>File Size:</h2>
                                <div className="flex flex-col justify-center ml-5">
                                    <p className="text-lg">{formatBytes(audit.importData.file.fileSize, 0)}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    :
                    <></>
            }
            {
                detailsType === "xero" ?
                    <div>
                        <div className=' mb-8 mt-8 flex'>
                            <h2 className='text-xl'>Connected to:</h2>
                            <div className="flex flex-col justify-center ml-5">
                                <p className="text-lg">{audit.importData.xero.connection.name}</p>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
            <div className=' grid grid-cols-4 gap-2 w-1/2 mx-auto mt-4'>
                <div className='col-span-2 col-start-2'>
                    {/* <Button
                        onClick={handleImportRemoval}
                        // onClick={}
                        variant="contained"
                        color='error'
                        sx={{
                            width: 1,
                        }}>Clear Import</Button> */}
                </div>
            </div>

        </>


    )


}
export default UploadDetails;