import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { DataGrid, } from '@mui/x-data-grid';
import { TextField, Button, InputAdornment, Checkbox } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import "react-datepicker/dist/react-datepicker.css";


import AccountDetailsBar from '../components/auditDetailsBar/AuditDetailsBar';

import "../../src/assets/css/excelToJson.css"
import '../components/topnav/topnav.css';
// import columns from "../components/utility/GridDefinitions/TransactionColumns"
import Export from '../components/SamplingComponents/exportBar/Export';
import PageHeader from '../components/layout/PageHeader/PageHeader';
import Loader from '../components/utility/Loader/Loader';
import SamplingControls from '../components/SamplingComponents/samplingControls/SamplingControls';





const SamplingDetails = (props) => {
    // Revamped stuff
    const audit = useSelector((state) => state.SaveAudit)


    const [isLoading, setIsLoading] = useState(false)
    const [refreshed, setRefreshed] = useState(true)



    const columns = [
        { field: 'accountNum', headerName: 'Type', flex: 1 },
        { field: 'accountName', headerName: 'Account', flex: 2 },
        {
            field: 'externalId',
            headerName: 'External Id',
            type: 'string',
            flex: 2,
        },
        {
            field: 'credit',
            headerName: 'Credit',
            type: 'string',
            flex: 1,
            valueGetter: (params) => {
                if (!params.value) {
                    return params.value;
                }
                // Convert the decimal value to a percentage
                return '$' + parseFloat(params.value).toLocaleString(2);
            },
        },
        {
            field: 'debit',
            headerName: 'Debit',
            type: 'string',
            flex: 1,
            valueGetter: (params) => {
                if (!params.value) {
                    return params.value;
                }
                // Convert the decimal value to a percentage
                return '$' + parseFloat(params.value).toLocaleString(2);
            },
        },
        {
            field: 'source',
            headerName: 'Source',
            type: 'string',
            flex: 2,
        },
        {
            field: 'date',
            headerName: 'Date',
            type: 'string',
            flex: 2,
        },
        {
            field: 'description',
            headerName: 'Description',
            type: 'string',
            flex: 3,
        },
    ];

    useEffect(() => {
        if (audit.auditDetails.sampling.sampledTransactions.length > 0) {
            console.log(audit)
            if (audit.auditDetails.sampling.sampledTransactions[0].xeroInvoiceId) {
                columns.push({

                    field: 'xeroInvoiceId',
                    headerName: '',
                    sortable: false,
                    headerAlign: "right",
                    align: "right",
                    renderCell: (params) => {


                        const api = params.api;
                        const thisRow = {};

                        api
                            .getAllColumns()
                            .filter((c) => c.field !== "__check__" && !!c)
                            .forEach(
                                (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
                            );

                        const isDebit = parseFloat(params.row.debit) > 0
                        const deepLink = `https://go.xero.com/organisationlogin/default.aspx?shortcode=` +
                            `${audit.importData.xero.connection.shortcode}&redirecturl=/` +
                            `${isDebit ? "AccountsReceivable" : "AccountsPayable"}` +
                            `/View.aspx?invoiceID=${thisRow.xeroInvoiceId}`

                        return (
                            <div>
                                <Button onClick={() => {
                                    console.log(thisRow.xeroInvoiceId)
                                    window.open(deepLink, "_blank")
                                }}><OpenInNew /></Button>
                            </div>
                        );
                    }

                })
            }

        }
    }, [audit.accounts.selectedAccounts, refreshed])




    return (
        <div className='ml-5'>
            <div className=''>
                <PageHeader
                    title={"Sampling Details"}
                // dropdownContent={<Export />}
                />
            </div>

            {/* <div className='flex'>
                <div className={`w-[100%] w-lg-1/2 min-h-full`}>
                    <AccountDetailsBar />
                </div>
                {audit.auditDetails.accounts.selectedAccounts.length != 0 && refreshed ?
                    <div className='w-1/2 h-full'>

                        <SamplingControls
                            audit={audit}
                            setRefreshed={setRefreshed}
                            setIsLoading={setIsLoading}
                        />
                    </div>
                    :
                    <></>
                }
            </div> */}

            <div className="row justify-center">
                <div className="col-12 row">
                    <div className="col-12">
                        {isLoading ?
                            <Loader />
                            :
                            <>

                                {/* {audit.auditDetails.sampling.sampledTransactions.length != 0 ?
                                    <div>
                                        <div className='flex justify-around mb-10'>
                                            {
                                                audit.auditDetails.sampling.samplePercentage != "" ?
                                                    <div className='col-3 text-center'>
                                                        <p className='my-2'>Transactions Sampled:</p>
                                                        <span className='text-3xl font-bold'>
                                                            {audit.auditDetails.sampling.creditSampled + audit.auditDetails.sampling.debitSampled}</span>
                                                    </div>
                                                    : <></>
                                            }
                                            {
                                                audit.auditDetails.sampling.samplePercentage != "" ?
                                                    <div className='col-3 text-center'>
                                                        <p className='my-2'>Sample Percentage:</p>
                                                        <span className='text-3xl font-bold'>{parseInt(audit.auditDetails.sampling.samplePercentage)}%</span>
                                                    </div>
                                                    : <></>
                                            }
                                            {
                                                audit.auditDetails.sampling.sampleInterval != "" ?
                                                    <div className='col-3 text-center'>
                                                        <p className='my-2'>Sample Interval: </p>
                                                        <span className='text-3xl font-bold'>${parseInt(audit.auditDetails.sampling.sampleInterval).toLocaleString()}</span>
                                                    </div>
                                                    : <></>
                                            }
                                        </div>
                                        <div className='w-100'>
                                            <DataGrid
                                                rows={audit.auditDetails.sampling.sampledTransactions}
                                                columns={columns}
                                                autoHeight={true}

                                                pageSize={100}
                                            />
                                        </div>
                                    </div> */}

                                {/* <div className='my-20 text-center'>

                                    {audit.auditDetails.accounts.selectedAccounts.length > 0 ?
                                        <h2 className=' w-3/4 mx-auto'>
                                            Sampled transactions will appear here, or all transactions will appear here when no criteria is input.
                                        </h2>
                                        :
                                        <>
                                            <h2 className=' w-3/4 mx-auto'>Transaction sampling will be available after an audit has been uploaded and accounts have been selected.</h2>
                                            <Button
                                                component={Link}
                                                to="/accounts"
                                                variant="contained"
                                                color='success'
                                                sx={{
                                                    width: 0.25,
                                                    mx: 'auto',
                                                    mt: "2rem",
                                                    "&:hover": {
                                                        color: "#fff"
                                                    }
                                                }}>Select Accounts</Button>
                                        </>
                                    }



                                </div> */}

                            </>
                        }
                    </div>
                </div>
                {/* </div> */}
            </div>
        </div>
    )
}

export default SamplingDetails