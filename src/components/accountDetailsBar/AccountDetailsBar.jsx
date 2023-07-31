import { useSelector } from "react-redux";

const AccountDetailsBar = () => {
    const audit = useSelector((state) => state.SaveAudit)
    return (
        <div className="col-12">
            <div className="card">
                <div className="card__body">
                    <div className='row h-20 mb-5'>

                        <div className='col-3 text-center h-100 flex flex-col justify-between'>
                            <p className='my-2'>Population: </p>
                            <p>
                                <span className='text-3xl font-bold'>${Math.abs(parseInt(audit.auditDetails.accounts.population)).toLocaleString()}</span><span className='font-bold'>{parseInt(audit.auditDetails.accounts.population) < 0 ? " CR" : " DR"}</span>
                            </p>
                        </div>
                        <div className='col-3 text-center h-100 flex flex-col justify-between'>
                            <p className='my-2'>No. of Transactions:</p>
                            <p><span className='text-3xl font-bold'>{(audit.auditDetails.accounts.transactionNum)}</span></p>
                        </div>
                        <div className='col-3 text-center h-100 flex flex-col justify-between'>
                            <p className='my-2'>Credit:</p>
                            <p>
                                <span className='text-3xl font-bold'>${(parseInt(audit.auditDetails.accounts.creditAmount).toLocaleString())}</span>
                            </p>
                        </div>
                        <div className='col-3 text-center h-100 flex flex-col justify-between'>
                            <p className='my-2'>Debit:</p>
                            <p>
                                <span className='text-3xl font-bold'>${(parseInt(audit.auditDetails.accounts.debitAmount).toLocaleString())}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountDetailsBar;