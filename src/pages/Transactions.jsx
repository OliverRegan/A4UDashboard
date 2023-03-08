import React, { useRef } from 'react';
import '../components/topnav/topnav.css';
import Table from '../components/table/Table'
import customerList from '../assets/JsonData/customers-list.json'
import { useSelector, useDispatch } from 'react-redux';
import { set } from "../redux/reducers/SaveSample";
import "react-datepicker/dist/react-datepicker.css";
import Axios from 'axios';
import { setSeedCode } from '../redux/reducers/SeedCode';
import { JsonToExcel } from "react-json-to-excel";


import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js/dist/html2pdf.min';

import "../../src/assets/css/excelToJson.css"
import { useEffect } from 'react';

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



const Transactions = (props) => {

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


    // Redux
    const dispatch = useDispatch();
    const select = useSelector;

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
    async function submit(event) {
        let db = debitIn.current.value === '' ? 0 : debitIn.current.value;
        let cr = creditIn.current.value === '' ? 0 : creditIn.current.value;
        let mt = materialityIn.current.value === '' ? 0 : materialityIn.current.value;
        let sc = seedIn.current.value === '' ? 0 : seedIn.current.value;

        dispatch(set([db, cr, mt, sc]));

        event.preventDefault();

        props.setSampledTransactions([]);

        // Upload endpoint url
        const transactionsUrl = process.env.REACT_APP_BACKEND_URL + "/audit/transactions"

        const body = {
            "BankAccounts": props.selectedAccounts,
            "MaterialityIn": mt,
            "DebitIn": db,
            "CreditIn": cr,
            "SeedCode": sc
        }




        await Axios.post(transactionsUrl, body)
            .then((response) => {

                // Reset errors
                props.setErr("");
                // Add response to sampled transactions to display
                let sampledTransactions = [];
                for (let i = 0; i < response.data.transactions.length; i++) {
                    sampledTransactions.push(response.data.transactions[i]);
                }

                dispatch(setSeedCode([response.data.seedCode, response.data.sampleInterval, response.data.samplePercentage]));
                props.setSampledTransactions(sampledTransactions);
            }).catch((error) => {
                // props.setErr(error.response.data.Message);
                console.log(error)
            })


    }

    // Export stuff
    const PDFJSX = () => {
        const date = new Date();
        const currentDateTime = date.getHours() + ":" + date.getMinutes() + " "
            + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        return (
            <div className='m-4 p-4'>
                <div className='my-3 flex justify-around'>
                    <div>
                        Date: {currentDateTime}
                    </div>
                    <div>
                        Auditor: {"Example user"}
                    </div>
                </div>
                <div className='my-3 flex justify-around'>
                    <div>
                        No. of samples: {props.sampledTransactions.length}
                    </div>
                    <div>
                        Seed Code: {seedCode}
                    </div>
                </div>
                <Table
                    headData={customerTableHead}
                    renderHead={(item, index) => renderHead(item, index)}
                    bodyData={props.sampledTransactions.length != [] ? props.sampledTransactions : customerList}
                    renderBody={(item, index) => renderBody(item, index, props)}

                />
            </div>
        )
    }
    const printHandler = () => {

        const printElement = ReactDOMServer.renderToString(PDFJSX());

        html2pdf().from(printElement).save();

    }

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
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">

                            <div class="grid w-full h-screen items-center justify-center bg-grey-lighter grid" className='form14'>
                                <form onSubmit={(event) => { submit(event) }} id="samplesForm">
                                    <div className='width-full text-center my-5 text-red'>
                                        {props.err}
                                    </div>
                                    <div className='row my-10 justify-around'>

                                        <div className='mx-10'>
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
                                        </div>




                                    </div>
                                    {props.sampledTransactions.length == 0 ?
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
                                    }



                                </form>
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
                    {(props.audit != null && props.selectedAccounts.length != 0) ?
                        <>
                            <div className="card">
                                <div className="card__body">
                                    <div className="items-center justify-center">
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
                                                samplePercentage != "0" ?
                                                    <div className='col-3 text-center'>
                                                        <p className='my-2'>Sample Percentage:</p>
                                                        <span className='text-3xl font-bold'>{parseInt(samplePercentage)}%</span>
                                                    </div>
                                                    : <></>
                                            }
                                            {
                                                sampleInterval != "0" ?
                                                    <div className='col-3 text-center'>
                                                        <p className='my-2'>Sample Interval: </p>
                                                        <span className='text-3xl font-bold'>${parseInt(sampleInterval).toLocaleString()}</span>
                                                    </div>
                                                    : <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card__body">
                                            <div className="col-12 justify-around flex">

                                            </div>

                                            <Table
                                                limit='10'
                                                headData={customerTableHead}
                                                renderHead={(item, index) => renderHead(item, index)}
                                                bodyData={props.sampledTransactions.length != [] ? props.sampledTransactions : customerList}
                                                renderBody={(item, index) => renderBody(item, index, props)}

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </>
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
            </div >
        </div >
    )
}

export default Transactions