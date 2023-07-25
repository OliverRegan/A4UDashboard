import React, { useRef } from 'react';
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

import { TextField, Button } from '@mui/material';


import "../../src/assets/css/excelToJson.css"
import '../components/topnav/topnav.css';
import "react-datepicker/dist/react-datepicker.css";

const customerTableHead = [
    "Type",
    "Account",
    "External ID",
    "ID",
    "Source",
    "Date",
    "Description",
    "Amount"
]

const columns = [
    { field: 'accountNum', headerName: 'Type', flex: 1 },
    { field: 'accountName', headerName: 'Account', flex: 1 },
    {
        field: 'externalId',
        headerName: 'External Id',
        type: 'string',
        flex: 1,
    },
    {
        field: 'credit',
        headerName: 'Credit',
        type: 'string',
        flex: 1,
    },
    {
        id: 'debit',
        headerName: 'Debit',
        type: 'string',
        flex: 1,
    },
    {
        field: 'source',
        headerName: 'Source',
        type: 'string',
        flex: 1,
    },
    {
        field: 'date',
        headerName: 'Date',
        type: 'string',
        flex: 1,
    },
    {
        field: 'description',
        headerName: 'Description',
        type: 'string',
        flex: 1,
    },
];

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{parseInt(item.debit) == 0 ? "Credit" : "Debit"}</td>
        <td>{item.accountNum}</td>
        <td>{item.accountName}</td>
        <td>{item.externalId}</td>
        <td>{item.source}</td>
        <td>{item.date}</td>
        <td>{item.description}</td>
        <td>{parseInt(item.debit) == 0 ? item.credit : item.debit}</td>
    </tr>
)

// Todo:
/*
- Formik for all form values
- Save to redux state store
- Load with useEffect
- will chop this BIG component down to basically nothing lol -- ezpz
*/


const Transactions = (props) => {

    // Revamped stuff
    const audit = useSelector((state) => state.SaveAudit)
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            credit: audit.auditDetails?.sampling.credit != '' ? audit.auditDetails.sampling.credit : '',
            debit: audit.auditDetails?.sampling.debit != '' ? audit.auditDetails.sampling.debit : '',
            materiality: audit.auditDetails?.sampling.materiality != '' ? audit.auditDetails.sampling.materiality : '',
            seed: audit.auditDetails?.sampling.seed != '' ? audit.auditDetails.sampling.seed : '',
        },
        onSubmit: values => {
            // Add data to redux store for current audit
            dispatch(setAudit([audit.file, audit.accounts, { ...audit.auditDetails, sampling: { ...audit.auditDetails.sampling, ...values } }]))

            const transactionsUrl = process.env.REACT_APP_BACKEND_URL + "/audit/transactions"

            const body = {
                "BankAccounts": audit.auditDetails.accounts.selectedAccounts,
                "MaterialityIn": values.materiality === '' ? 0 : values.materiality,
                "DebitIn": values.debit === '' ? 0 : values.debit,
                "CreditIn": values.credit === '' ? 0 : values.credit,
                "SeedCode": values.seed === '' ? '0' : values.seed, // It needs to be a string and don't ask why
            }
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
                    // // Reset errors
                    // props.setErr("");
                    // // Add response to sampled transactions to display
                    // let sampledTransactions = [];
                    // for (let i = 0; i < response.data.transactions.length; i++) {
                    //     sampledTransactions.push(response.data.transactions[i]);
                    // }
                    // dispatch(setSeedCode([response.data.seedCode, response.data.sampleInterval, response.data.samplePercentage]));
                    // props.setSampledTransactions(sampledTransactions);
                    let transactions = []
                    response.transactions.forEach(transaction => {
                        let transNew = transaction
                        transNew.id = response.transactions.indexOf(transaction)
                        transactions.push(transNew)
                    })

                    dispatch(setAudit([audit.file, audit.accounts, {
                        ...audit.auditDetails,
                        sampling: {
                            ...audit.auditDetails.sampling,
                            sampledTransactions: transactions,
                            seed: response.seedCode,
                            samplePercentage: response.samplePercentage,
                            sampleInterval: response.sampleInterval,
                        }
                    }]))
                    console.log(audit)
                }).catch((error) => {
                    // props.setErr(error.response.Message);
                })
        },
    });


    // =========================================================================================================

    // References
    const creditIn = useRef(null);
    const debitIn = useRef(null);
    const materialityIn = useRef(null);
    const seedIn = useRef(null);

    const uniqueFileName = require('unique-filename');


    // Get previous samples
    let creditPrev = useSelector((state) => state.SaveSample.credit);
    let debitPrev = useSelector((state) => state.SaveSample.debit);
    let materialityPrev = useSelector((state) => state.SaveSample.materiality);
    let seedPrev = useSelector((state) => state.SaveSample.seedCode);


    let seedCode = useSelector((state) => state.SeedCode.code);
    let sampleInterval = useSelector((state) => state.SeedCode.sampleInterval);
    let samplePercentage = useSelector((state) => state.SeedCode.samplePercentage);

    let populationBalance = 0;
    let populationCr = 0;
    let populationDb = 0;
    let populationCount = 0;

    props.selectedAccounts.forEach(account => {
        populationBalance += (parseInt(account.totalDebit) - parseInt(account.totalCredit));
        populationCr += parseInt(account.totalCredit);
        populationDb += parseInt(account.totalDebit);
        populationCount += account.transactions.length;
    });


    // Handle submit
    // async function submit(event) {
    //     let db = debitIn.current.value === '' ? 0 : debitIn.current.value;
    //     let cr = creditIn.current.value === '' ? 0 : creditIn.current.value;
    //     let mt = materialityIn.current.value === '' ? 0 : materialityIn.current.value;
    //     let sc = seedIn.current.value === '' ? 0 : seedIn.current.value;

    //     dispatch(set([db, cr, mt, sc]));

    //     event.preventDefault();

    //     props.setSampledTransactions([]);

    //     // Upload endpoint url
    //     const transactionsUrl = process.env.REACT_APP_BACKEND_URL + "/audit/transactions"

    //     const body = {
    //         "BankAccounts": props.selectedAccounts,
    //         "MaterialityIn": mt,
    //         "DebitIn": db,
    //         "CreditIn": cr,
    //         "SeedCode": sc
    //     }




    //     await Axios.post(transactionsUrl, body)
    //         .then((response) => {

    //             // Reset errors
    //             props.setErr("");
    //             // Add response to sampled transactions to display
    //             let sampledTransactions = [];
    //             for (let i = 0; i < response.data.transactions.length; i++) {
    //                 sampledTransactions.push(response.data.transactions[i]);
    //             }

    //             dispatch(setSeedCode([response.data.seedCode, response.data.sampleInterval, response.data.samplePercentage]));
    //             props.setSampledTransactions(sampledTransactions);
    //         }).catch((error) => {
    //             // props.setErr(error.response.data.Message);
    //             console.log(error)
    //         })
    // }




    let excelMetaData = [
        {
            "User": "Example User",
            "Seed Code": seedCode,
            "Date": new Date().getHours() + ":" + (new Date().getMinutes() < 10 ? "0" : "") + new Date().getMinutes() + " "
                + new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear(),
            "Number of Sampled": props.sampledTransactions.length

        },
        ...props.sampledTransactions]

    return (
        <div>
            <h2 className="page-header">
                Sampling
            </h2>
            <div className="row justify-center">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">

                            {/* <div class="grid w-full h-screen items-center justify-center bg-grey-lighter grid" className='form14'> */}
                            {/* <form onSubmit={(event) => { submit(event) }} id="samplesForm"> */}
                            {/* <div className='width-full text-center my-5 text-red'>
                                {props.err}
                            </div> */}
                            {/* <div className='row my-10 justify-around'> */}
                            <form onSubmit={formik.handleSubmit}>

                                <TextField
                                    label="Credit Samples"
                                    // variant='contained'
                                    placeholder='Credit Samples'
                                    variant='filled'
                                    size='small'
                                    sx={{
                                        my: "4px"
                                    }}
                                    id="credit"
                                    name="credit"
                                    type="number"
                                    onChange={formik.handleChange}
                                    value={formik.values.credit}
                                />
                                <TextField
                                    label="Debit Samples"
                                    // variant='contained'
                                    placeholder='Debit Samples'
                                    variant='filled'
                                    size='small'
                                    sx={{
                                        my: "4px"
                                    }}
                                    id="debit"
                                    name="debit"
                                    type="number"
                                    onChange={formik.handleChange}
                                    value={formik.values.debit}
                                />
                                <TextField
                                    label="Materiality Input"
                                    // variant='contained'
                                    placeholder='Materiality Input'
                                    variant='filled'
                                    size='small'
                                    sx={{
                                        my: "4px"
                                    }}
                                    id="materiality"
                                    name="materiality"
                                    type="number"
                                    onChange={formik.handleChange}
                                    value={formik.values.materiality}
                                />
                                <TextField
                                    label="Seed Code Input"
                                    // variant='contained'
                                    placeholder='Seed Code Input'
                                    variant='filled'
                                    size='small'
                                    sx={{
                                        my: "4px"
                                    }}
                                    id="seed"
                                    name="seed"
                                    type="number"
                                    onChange={formik.handleChange}
                                    value={formik.values.seed}
                                />
                                <Button
                                    type='submit'
                                    variant='contained'
                                    sx={{
                                        mt: '1rem',
                                        width: 1 / 2,
                                        mx: 'auto'
                                    }}>Do some samplin</Button>
                            </form>
                            {/* <div className='mx-10'>
                                            <p className="p1">Number of Credit samples</p><br />
                                            <div className="topnav__search">
                                                <input type="number" placeholder='' ref={creditIn} defaultValue={creditPrev} className="px-20" />

                                            </div><br />
                                        </div>
                                        <div className='mx-10'>
                                            <p className="p1">Number Of Debit samples</p><br />
                                            <div className="topnav__search">
                                                <input type="number" placeholder='' ref={debitIn} defaultValue={debitPrev} className="px-20" />
                                            </div><br />
                                        </div>
                                        <div className='mx-10'>
                                            <p className="p1">Materiality Sample ($)</p><br />
                                            <div className="topnav__search">
                                                <input type="number" placeholder='' ref={materialityIn} defaultValue={materialityPrev} className="px-20" />
                                            </div><br />
                                        </div>
                                        <div className='mx-10'>
                                            <p className="p1">Seed Code Input</p><br />
                                            <div className="topnav__search">
                                                <input type="number" placeholder='' ref={seedIn} defaultValue={seedPrev} className="px-20" />
                                            </div><br />
                                        </div> */}
                            {/* </div> */}
                            {/* {props.sampledTransactions.length == 0 ?
                                    <></>
                                    :
                                    <div className='flex'>
                                        <div className='text-center select-transactions mt-4 mx-auto w-1/6'>
                                            <button className='bg-red hover:bg-green-100 w-full py-4 my-4' type="button" onClick={() => { printHandler() }}>
                                                <p>Export to PDF
                                                </p>
                                            </button>
                                        </div>

                                    </div>

                                }
                                {props.sampledTransactions.length == 0 ?
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

                                }


                                <div className='flex'>
                                    <div className='text-center select-transactions mb-10 mx-auto w-1/3'>
                                        <p>Audit Seed Code: <span className='text-blue'>{seedCode === "" ? "Nothing here yet" : seedCode}</span>
                                        </p>
                                    </div>
                                </div>
                                {(props.audit != null && props.selectedAccounts.length != 0) ?

                                    <div className='flex'>
                                        <div className='text-center select-transactions mt-4 mx-auto w-1/3'>
                                            <button className='bg-blue hover:bg-green w-full py-4' type='submit'>
                                                <p>Sample Transactions
                                                </p>
                                            </button>
                                        </div>
                                    </div>
                                    :
                                    <></>
                                } */}



                            {/* </form> */}
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

                </div>


                <div className="row col-12 justify-center">
                    <div className="col-12 row">
                        <div className="card col-12">
                            <div className="card__body">
                                {audit.auditDetails.sampling.sampledTransactions.length != 0 ?
                                    <div>
                                        <div className='flex justify-around '>
                                            <div className='col-3 text-center'>
                                                <p className='my-2'>Population: </p>
                                                <span className='text-3xl font-bold'>${populationBalance.toLocaleString()}</span><span className='font-bold'>{populationBalance < 0 ? " CR" : " DR"}</span>
                                            </div>
                                            <div className='col-3 text-center'>
                                                <p className='my-2'>No. of Transactions:</p>
                                                <span className='text-3xl font-bold'>{(populationCount)}</span>
                                            </div>
                                            <div className='col-3 text-center'>
                                                <p className='my-2'>Credit:</p>
                                                <span className='text-3xl font-bold'>${(populationCr.toLocaleString())}</span>
                                            </div>
                                            <div className='col-3 text-center'>
                                                <p className='my-2'>Debit:</p>
                                                <span className='text-3xl font-bold'>${(populationDb.toLocaleString())}</span>
                                            </div>
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
                                                // getRowId={(row) => audit.auditDetails.sampling.sampledTransactions.indexOf(row)}
                                                columns={columns}
                                                autoHeight={true}
                                                checkboxSelection
                                                // onSelectionModelChange={(ids) => {
                                                //     const selectedRowsData = ids.map((id) => audit.auditDetails.sampling.sampledTransactions.find((row) => row.id === id));
                                                //     accounts: {
                                                //         dispatch(setAudit([audit.file, audit.auditDetails.sampling.sampledTransactions, {
                                                //             ...audit.auditDetails,
                                                //             accounts: {
                                                //                 ...audit.auditDetails.accounts,
                                                //                 selectedAccounts: selectedRowsData
                                                //             }
                                                //         }]))
                                                //     }
                                                // }}
                                                // selectionModel={audit.auditDetails.accounts.selectedAccounts.map((row) => row.id)}
                                                pageSize={100}
                                            />
                                        </div>
                                    </div>
                                    :
                                    <div className='card'>
                                        <div className='my-20'>
                                            <h2 className='text-center w-3/4 mx-auto'>
                                                Transaction sampling will be available after an audit has been uploaded and accounts have been selected.
                                            </h2>
                                        </div>
                                    </div>
                                }
                            </div >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transactions