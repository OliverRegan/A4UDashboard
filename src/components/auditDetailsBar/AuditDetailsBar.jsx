import { useSelector } from "react-redux";

const AuditDetailsBar = () => {
    const audit = useSelector((state) => state.SaveAudit)
    return (
        <div className="min-h-full">
            {Object.keys(audit.auditDetails).length === 0 ? <></>
                :
                <div className="flex flex-col justify-around">
                    <div className=' mb-8 mt-8 grid grid-cols-12'>
                        <h2 className='text-xl col-span-4'>Audit Name:</h2>
                        <div className="flex flex-col justify-center ml-5 col-span-7">
                            <p className="text-lg">{audit.auditDetails.auditName === "" ? "-" : audit.auditDetails.auditName}</p>
                        </div>
                    </div>
                    <div className=' mb-8 mt-8  grid grid-cols-12'>
                        <h2 className='text-xl col-span-4'>Client Name:</h2>
                        <div className="flex flex-col justify-center ml-5 col-span-7">
                            <p className="text">{audit.auditDetails.clientName === "" ? "-" : audit.auditDetails.clientName}</p>
                        </div>
                    </div>
                    <div className=' mb-8 mt-8  grid grid-cols-12'>
                        <h2 className='text-xl col-span-4'>Financial Year:</h2>
                        <div className="flex flex-col justify-center ml-5 col-span-7">
                            <p className="text-lg">{audit.auditDetails.financialYear === "" ? "-" : audit.auditDetails.financialYear}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default AuditDetailsBar;