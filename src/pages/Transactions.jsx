import React, { useRef, useState } from 'react';
import Table from '../components/table/Table'
import customerList from '../assets/JsonData/customers-list.json'
import { useSelector, useDispatch } from 'react-redux';
import { set } from "../redux/reducers/SaveSample";
import Axios from 'axios';
import { setSeedCode } from '../redux/reducers/SeedCode';
import { JsonToExcel } from "react-json-to-excel";
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js/dist/html2pdf.min';
import { useFormik } from 'formik';
import { setAudit } from '../redux/reducers/SaveAudit';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import AccountDetailsBar from '../components/accountDetailsBar/AccountDetailsBar';
import { TextField, Button, InputAdornment, Box, Typography, Checkbox } from '@mui/material';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import "../../src/assets/css/excelToJson.css"
import '../components/topnav/topnav.css';
import "react-datepicker/dist/react-datepicker.css";
import columns from "../components/utility/GridDefinitions/TransactionColumns"
import ExportBar from '../components/exportBar/ExportBar';

function getSeedObj(seed) {
    if (seed == "No Transactions Sampled") {
        return {
            seed: '',
            credit: '',
            debit: '',
            materiality: ''
        }
    } else {
        return {
            seed: seed,
            credit: seed.split('-')[1],
            debit: seed.split('-')[2],
            materiality: seed.split('-')[3]
        }
    }
}


const Transactions = (props) => {

    // Revamped stuff
    const audit = useSelector((state) => state.SaveAudit)
    const dispatch = useDispatch()

    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            credit: audit.auditDetails?.sampling.credit != '' ? audit.auditDetails.sampling.credit : '',
            debit: audit.auditDetails?.sampling.debit != '' ? audit.auditDetails.sampling.debit : '',
            materiality: audit.auditDetails?.sampling.materiality != '' ? audit.auditDetails.sampling.materiality : '',
            seedInput: audit.auditDetails?.sampling.seedInput != '' ? audit.auditDetails.sampling.seedInput : '',
            useSeed: audit.auditDetails?.sampling.useSeed,
        },
        onSubmit: values => {
            setIsLoading(true)

            // Add data to redux store for current audit
            dispatch(setAudit([audit.file, audit.accounts, { ...audit.auditDetails, sampling: { ...audit.auditDetails.sampling, ...values } }]))

            const transactionsUrl = process.env.REACT_APP_BACKEND_URL + "/audit/transactions"

            const body = {
                "BankAccounts": audit.auditDetails.accounts.selectedAccounts,
                "MaterialityIn": values.materiality === '' ? 0 : values.materiality,
                "DebitIn": values.debit === '' ? 0 : values.debit,
                "CreditIn": values.credit === '' ? 0 : values.credit,
                "SeedCode": values.seedInput === '' ? '0' : values.seedInput, // It needs to be a string and don't ask why
            }
            console.log(body)
            fetch(transactionsUrl, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(body)
            })
                .then((res) => res.json())
                .then((response) => {
                    console.log(response)
                    let transactions = []
                    response.transactions.forEach(transaction => {
                        let transNew = transaction
                        transNew.id = response.transactions.indexOf(transaction)
                        transactions.push(transNew)
                    })
                    let seedObj = getSeedObj(response.seedCode)
                    dispatch(setAudit([audit.file, audit.accounts, {
                        ...audit.auditDetails,
                        sampling: {
                            ...audit.auditDetails.sampling,
                            ...values,
                            sampledTransactions: transactions,
                            credit: seedObj.credit,
                            debit: seedObj.debit,
                            materiality: seedObj.materiality,
                            seed: seedObj.seed,
                            samplePercentage: response.samplePercentage,
                            sampleInterval: response.sampleInterval,
                            creditSampled: response.creditSampled,
                            debitSampled: response.debitSampled
                        }
                    }]))
                    setError('')
                    setIsLoading(false)
                }).catch((error) => {
                    console.log(error)
                    setError(error)
                })
        },
    });
    console.log(audit)
    function clearSamples() {
        dispatch(setAudit([audit.file, audit.accounts, {
            ...audit.auditDetails,
            sampling: {
                sampledTransactions: [],
                useSeed: false,
                credit: '',
                debit: '',
                materiality: '',
                seedInput: '',
                seed: '',
                sampleInterval: '',
                samplePercentage: '',
                creditSampled: 0,
                debitSampled: 0
            }
        }]))
        formik.resetForm()
        setIsLoading(false)
    }

    const uniqueFileName = require('unique-filename');

    // let excelMetaData = [
    //     {
    //         "User": "Example User",
    //         "Seed Code": seedCode,
    //         "Date": new Date().getHours() + ":" + (new Date().getMinutes() < 10 ? "0" : "") + new Date().getMinutes() + " "
    //             + new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear(),
    //         "Number of Sampled": props.sampledTransactions.length

    //     },
    //     ...props.sampledTransactions]

    return (
        <div className='ml-5'>
            <h2 className="page-header">
                Sampling
            </h2>
            <div className="row justify-center">

                {audit.auditDetails.accounts.selectedAccounts.length != 0 ?
                    <>
                        <AccountDetailsBar />
                        <div className="col-12">
                            <div className="card">
                                <div className="card__body">
                                    <form onSubmit={event => {
                                        event.preventDefault();
                                        formik.handleSubmit(event);
                                    }
                                    }>
                                        <div className='grid grid-cols-4 w-3/4 mx-auto'>

                                            <div className='col-span-2'>
                                                <TextField
                                                    label="Credit Samples"
                                                    // variant='contained'
                                                    placeholder='Credit Samples'
                                                    disabled={formik.values.useSeed}

                                                    variant='filled'
                                                    size='small'
                                                    sx={{
                                                        my: "4px",
                                                        width: 1
                                                    }}
                                                    id="credit"
                                                    name="credit"
                                                    type="number"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.credit}
                                                />
                                            </div>
                                            <div className='col-span-2'>
                                                <TextField
                                                    label="Debit Samples"
                                                    // variant='contained'
                                                    placeholder='Debit Samples'
                                                    disabled={formik.values.useSeed}
                                                    variant='filled'
                                                    size='small'
                                                    sx={{
                                                        my: "4px",
                                                        width: 1
                                                    }}
                                                    id="debit"
                                                    name="debit"
                                                    type="number"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.debit}
                                                />
                                            </div>
                                            <div className='col-span-2'>
                                                <TextField
                                                    label="Materiality Input"
                                                    // variant='contained'
                                                    placeholder='Materiality Input'
                                                    disabled={formik.values.useSeed}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                    }}
                                                    variant='filled'
                                                    size='small'
                                                    sx={{
                                                        my: "4px",
                                                        width: 1
                                                    }}
                                                    id="materiality"
                                                    name="materiality"
                                                    type="number"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.materiality}
                                                />
                                            </div>
                                            <div className='col-span-1 flex flex-col'>
                                                <div className='text-right row grow justify-around px-3'>
                                                    <div className="flex flex-col justify-center">
                                                        <p>Use Seed Code:</p>
                                                    </div>

                                                    <Checkbox sx={{}}
                                                        checked={formik.values.useSeed}
                                                        onClick={() => {
                                                            formik.setFieldValue('useSeed', !formik.values.useSeed);
                                                            if (!formik.values.useSeed) {
                                                                formik.setFieldValue('credit', '')
                                                                formik.setFieldValue('debit', '')
                                                                formik.setFieldValue('materiality', '')
                                                            } else {
                                                                formik.setFieldValue('seeInput', '')
                                                            }
                                                        }} />

                                                </div>
                                            </div>
                                            <div className='col-span-1'>
                                                <TextField
                                                    label="Seed Code Input"
                                                    // variant='contained'
                                                    placeholder='Seed Code Input'
                                                    disabled={!formik.values.useSeed}
                                                    variant='filled'
                                                    size='small'
                                                    sx={{
                                                        my: "4px",
                                                        width: 1
                                                    }}
                                                    id="seedInput"
                                                    name="seedInput"
                                                    type="string"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.seedInput}
                                                />
                                            </div>
                                            <div className='col-span-2'>
                                                <Button
                                                    type='submit'
                                                    variant='contained'
                                                    color='success'
                                                    sx={{
                                                        mt: '1rem',
                                                        width: 1,
                                                        mx: 'auto'
                                                    }}>Sample Transactions</Button>
                                            </div>
                                            <div className='col-span-2'>
                                                <Button
                                                    onClick={() => clearSamples()}
                                                    variant='contained'
                                                    color='error'
                                                    sx={{
                                                        mt: '1rem',
                                                        width: 1,
                                                        mx: 'auto'
                                                    }}>Clear Samples</Button>
                                            </div>

                                            <div className='text-center select-transactions mt-10 mx-auto col-span-2 col-start-2'>
                                                <p>Audit Seed Code:
                                                    <span className='text-blue-500'> {audit.auditDetails.sampling.seed === "" ? "Nothing here yet" : audit.auditDetails.sampling.seed}</span>
                                                </p>
                                            </div>
                                        </div>

                                    </form>

                                    {/* {props.sampledTransactions.length == 0 ?
                                    <></>
                                    :
                                    <div className='flex'>
                                        <div className='text-center select-transactions my-4 mx-auto w-1/6'>
                                            <JsonToExcel
                                                title="Download as Excel"
                                                data={excelMetaData}
                                                fileName={uniqueFileName("", "Audit")}
                                                btnClassName="excel-btn"
                                            />
                                        </div>
                                    </div>
                                } */}
                                    <div className="topnav__right">
                                        <div className="topnav__right-item">
                                            {/*<Dropdown
                                                    customToggle={() => renderUserToggle(curr_user)}
                                                    contentData={user_menu}
                                                    renderItems={(item, index) => renderUserMenu(item, index)}
                                            />*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                audit.auditDetails.sampling.sampledTransactions.length > 0 ?
                                    <ExportBar audit={audit} />
                                    :
                                    <></>
                            }

                        </div>
                    </>
                    :
                    <></>
                }
                <div className="col-12 row">
                    <div className="card col-12">
                        <div className="card__body">
                            {isLoading ?
                                <div className="flex justify-center my-4">
                                    <div role="status">
                                        <svg aria-hidden="true" class="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                    </div>
                                </div>
                                :
                                <>
                                    {audit.auditDetails.sampling.sampledTransactions.length != 0 ?
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
                                        </div>
                                        :
                                        <div className='my-20 text-center'>

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



                                        </div>
                                    }
                                </>
                            }
                        </div >
                    </div>
                </div>
                {/* </div> */}
            </div>
        </div>
    )
}

export default Transactions