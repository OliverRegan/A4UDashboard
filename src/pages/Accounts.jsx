import React, { useState, useEffect } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
// Material UI
import { Typography, Box } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Table from '../components/table/Table'

import { useSelector, useDispatch } from 'react-redux'

import { Link } from 'react-router-dom/cjs/react-router-dom'
import { setAudit } from '../redux/reducers/SaveAudit'

const columns = [
    { field: 'accountNum', headerName: 'Account Number', flex: 1 },
    { field: 'name', headerName: 'Account Name', flex: 1 },
    {
        field: 'totalCredit',
        headerName: 'Total Credit',
        type: 'number',
        flex: 1,
    },
    {
        field: 'totalDebit',
        headerName: 'Total Debit',
        type: 'number',
        flex: 1,
    },
];



const Accounts = (props) => {

    // Set variable for forcing rerender on selection of account
    const [population, setPopulation] = useState(0);
    const [selectionModel, setSelectionModel] = useState()

    const audit = useSelector((state) => state.SaveAudit)
    const dispatch = useDispatch()

    useEffect(() => {
        let count = 0;
        audit.auditDetails.selectedAccounts.map((acc) => {
            count += (parseInt(acc.totalDebit) - parseInt(acc.totalCredit))

        })
        setPopulation(() => count)
        console.log(audit)
    }, [audit])

    return (
        <div>
            <div className='row pb-4'>
                <h2 className="page-header col-12">
                    Select Accounts
                </h2>
                {Object.keys(audit.auditDetails).length === 0 ? <></>
                    :
                    <div className='row pl-5'>
                        <div className='my-1 col-12'>
                            <div className='flex col-12'>
                                <div className='col-8'>
                                    <h2>Audit:</h2>
                                </div>
                                <div className='flex flex-col justify-end'>
                                    <p className='align-middle'>
                                        {audit.auditDetails.auditName === "" ? "-" : audit.auditDetails.auditName}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='my-1 col-12'>
                            <div className='flex col-12'>
                                <div className='col-8'>
                                    <h3>Client Name:</h3>
                                </div>
                                <div className='flex flex-col justify-end'>
                                    <p className='align-middle'>
                                        {audit.auditDetails.clientName === "" ? "-" : audit.auditDetails.clientName}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='my-1 col-12'>
                            <div className='flex col-12'>
                                <div className='col-8'>
                                    <h3>Financial Year:</h3>
                                </div>
                                <div className='flex flex-col justify-end'>
                                    <p className='align-middle'>
                                        {audit.auditDetails.financialYear === "" ? "-" : audit.auditDetails.financialYear}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div className='row py-5'>
                <div className='mb-3 col-12'>
                    <div className='row justify-end'>
                        <div className=' py-2 px-4 flex min-h-15 justify-items-end'>
                            {audit.auditDetails.selectedAccounts.length != 0 ?
                                <Link
                                    to="/sampling"
                                    className={"h-10 text-center font-bold px-4 rounded w-100 hover:text-light-blue text-blue"} >
                                    Go to sampling <ChevronRightIcon className='align-middle' />
                                </Link>
                                :
                                <p className='h-10'>
                                    <br />
                                </p>
                            }
                        </div>
                    </div>
                    <div className="card">
                        <div className="card__body">
                            <div className="items-center justify-center">
                                <div className='flex justify-around '>
                                    <div className='col-10 text-center'>
                                        <p className='my-2'>Population: </p>
                                        <span className='text-3xl font-bold'>${(population > 0 ? population : Math.abs(population)).toLocaleString()}</span><span className='font-bold'>{population != 0 ? population < 0 ? " CR" : " DR" : ""}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            {audit.accounts.length != 0 ?
                                <div>
                                    <div className='w-100 h-'>
                                        <DataGrid
                                            rows={audit.accounts}
                                            getRowId={(row) => audit.accounts.indexOf(row)}
                                            columns={columns}
                                            autoHeight={true}
                                            checkboxSelection
                                            onSelectionModelChange={(ids) => {
                                                const selectedRowsData = ids.map((id) => audit.accounts.find((row) => row.id === id));
                                                dispatch(setAudit([audit.file, audit.accounts, { ...audit.auditDetails, selectedAccounts: selectedRowsData }]))
                                            }}
                                            selectionModel={audit.auditDetails.selectedAccounts.map((row) => row.id)}
                                            pageSize={100}
                                        />
                                    </div>
                                </div>
                                :
                                <div className='my-20'>
                                    <h2 className='text-center'>
                                        Accounts will be displayed once an audit has been uploaded
                                    </h2>
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Accounts
