import React, { useState, useEffect } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { Typography, Button } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { OpenInNew } from '@mui/icons-material';

import { setAudit } from '../redux/reducers/SaveAudit'
import AuditDetailsBar from '../components/auditDetailsBar/AuditDetailsBar';
import PageHeader from '../components/utility/PageHeader/PageHeader';

const Accounts = (props) => {

    // Set variable for forcing rerender on selection of account
    const audit = useSelector((state) => state.SaveAudit)
    const dispatch = useDispatch()
    const [refinedAccounts, setRefinedAccounts] = useState([])

    const columns = [
        {
            field: 'accountNum',
            headerName: 'Account Number',
            flex: 1,
            valueGetter: (params) => {
                if (params.value === "0") {
                    return "No Account Number";
                } else {
                    return params.value
                }
            },
        },
        { field: 'name', headerName: 'Account Name', flex: 1 },
        {
            field: 'totalCredit',
            headerName: 'Total Credit',
            type: 'number',
            sortable: true,
            flex: 1,
            valueGetter: (params) => {
                // Convert the decimal value to a percentage
                return params.value;
            },
            valueFormatter: (params) => {
                if (!params.value) {
                    return params.value;
                }
                // Convert the decimal value to a percentage
                return '$' + parseFloat(params.value).toLocaleString(2);
            },
        },
        {
            field: 'totalDebit',
            headerName: 'Total Debit',
            type: 'number',
            flex: 1,
            valueGetter: (params) => {
                // Convert the decimal value to a percentage
                return params.value;
            },
            valueFormatter: (params) => {
                if (!params.value) {
                    return params.value;
                }
                // Convert the decimal value to a percentage
                return '$' + parseFloat(params.value).toLocaleString(2);
            },
        },
    ];

    useEffect(() => {
        let count = 0;
        let populationBalance = 0;
        let populationCr = 0;
        let populationDb = 0;
        // TODO: Move to back end
        audit.auditDetails.accounts.selectedAccounts.map((acc) => {
            populationBalance += (parseInt(acc.totalDebit) - parseInt(acc.totalCredit))
            count += acc.transactions.length
            populationCr += Math.abs(acc.totalCredit)
            populationDb += Math.abs(acc.totalDebit)
        })

        dispatch(setAudit([audit.importData, audit.connectionType,
        audit.accounts, {
            ...audit.auditDetails,
            accounts: {
                ...audit.auditDetails.accounts,
                population: populationBalance,
                transactionNum: count,
                creditAmount: populationCr,
                debitAmount: populationDb

            }
        }]))
    }, [audit.auditDetails.accounts.selectedAccounts, refinedAccounts])

    // TODO: Move to back end
    function toggleZeroAccounts() {

        if (refinedAccounts.length > 0) {
            setRefinedAccounts(() => []);
        } else {
            let nonZeroAccounts = []
            audit.accounts.forEach(acc => {
                console.log(parseInt(acc.totalNetActivity))
                if (parseInt(acc.totalNetActivity) != 0) {
                    nonZeroAccounts.push(acc)
                    console.log("hello")
                }
            })
            setRefinedAccounts(() => nonZeroAccounts)
        }

    }


    // if (audit.accounts.length > 0) {

    //     if (audit.accounts[0].xeroAccountId) {
    //         columns.push({

    //             field: 'xeroAccountId',
    //             headerName: '',
    //             sortable: false,
    //             flex: 1,
    //             headerAlign: "right",
    //             align: "right",
    //             renderCell: (params) => {


    //                 const api = params.api;
    //                 const thisRow = {};

    //                 api
    //                     .getAllColumns()
    //                     .filter((c) => c.field !== "__check__" && !!c)
    //                     .forEach(
    //                         (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
    //                     );


    //                 return (
    //                     <div>
    //                         <Button onClick={() => {
    //                             window.open(`https://go.xero.com/Bank/BankTransactions.aspx?accountID=${thisRow.xeroAccountId}`, "_blank")
    //                         }}>View in Xero</Button>
    //                     </div>
    //                 );
    //             }

    //         })
    //     }

    // }


    return (
        <div>
            <PageHeader title={"Select Accounts"} />
            <div className='flex'>
                <div className='w-1/2'>
                    <AuditDetailsBar />
                </div>
                <div className='w-1/2'>
                    <div className=' mb-8 mt-8 row justify-between'>
                        <h2 className='text-xl col-4'>Population:</h2>
                        <div className="flex flex-col justify-center ml-5 col-7">
                            <p className="text-lg">${(!audit.auditDetails.accounts.population > 0 ? audit.auditDetails.accounts.population : Math.abs(audit.auditDetails.accounts.population)).toLocaleString()}<span className='font-bold'>{audit.auditDetails.accounts.population != 0 ? audit.auditDetails.accounts.population < 0 ? " CR" : " DR" : ""}</span></p>
                        </div>
                    </div>
                    <div className='w-1/2 my-3'>
                        <Button
                            variant='contained'
                            onClick={() => toggleZeroAccounts()}
                            sx={{
                                width: 1
                            }}
                        >
                            Toggle $0 accounts
                        </Button>
                    </div>
                    <div className='w-1/2 my-3'>
                        <Button
                            variant='contained'
                            component={Link}
                            disabled={audit.auditDetails.accounts.selectedAccounts.length === 0}
                            to="/dashboard/sampling"
                            sx={{
                                width: 1
                            }}
                        >
                            Go to sampling <ChevronRightIcon className='align-middle' />
                        </Button>
                    </div>

                </div>
            </div>

            <div className='row py-5'>
                <div className='mb-3 col-12'>
                    {/* <div className='row justify-end'>
                        <div className=' py-2 px-4 flex min-h-15 justify-items-end'>
                            {audit.auditDetails.accounts.selectedAccounts.length != 0 ?
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
                    </div> */}
                </div>
            </div>
            <div className="row">
                <div className="col-12">

                    {audit.accounts.length != 0 ?
                        <div>
                            <div className='w-100'>
                                <DataGrid
                                    rows={refinedAccounts.length == 0 ? audit.accounts : refinedAccounts}
                                    getRowId={(row) => audit.accounts.indexOf(row)}
                                    columns={columns}
                                    autoHeight={true}
                                    checkboxSelection
                                    onSelectionModelChange={(ids) => {
                                        const selectedRowsData = ids.map((id) => audit.accounts.find((row) => row.id === id));
                                        accounts: {
                                            dispatch(setAudit([audit.importData, audit.connectionType,
                                            audit.accounts, {
                                                ...audit.auditDetails,
                                                accounts: {
                                                    ...audit.auditDetails.accounts,
                                                    selectedAccounts: selectedRowsData
                                                }
                                            }]))
                                        }
                                    }}
                                    selectionModel={audit.auditDetails.accounts.selectedAccounts.map((row) => row.id)}
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
        </div >
    )
}

export default Accounts
