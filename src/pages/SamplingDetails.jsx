import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setAudit } from '../redux/reducers/SaveAudit';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";

import useGetToken from '../components/utility/Auth/useGetToken';
import { useMsal } from "@azure/msal-react";
import AccountDetailsBar from '../components/auditDetailsBar/AuditDetailsBar';
import "../../src/assets/css/excelToJson.css"
import '../components/topnav/topnav.css';
// import columns from "../components/utility/GridDefinitions/TransactionColumns"
import Export from '../components/SamplingComponents/exportBar/Export';
import PageHeader from '../components/utility/PageHeader/PageHeader';
import Loader from '../components/utility/Loader/Loader';
import SamplingControls from '../components/SamplingComponents/samplingControls/SamplingControls';
import SampledTransactionDetail from '../components/sampledTransactionDetail/SampledTransactionDetail';
import { GetCookie } from '../components/utility/Cookies/SetGetCookie';
import { ValidateXeroAuth } from '../components/utility/Auth/XeroAuth/XeroAuthHooks';

import sampleDetails from "../assets/JsonData/SampleDetails.json"


const SamplingDetails = (props) => {
    // Revamped stuff
    const audit = useSelector((state) => state.SaveAudit)
    const [isLoading, setIsLoading] = useState(false)
    const [refreshed, setRefreshed] = useState(true)
    const { instance } = useMsal()
    const getToken = useGetToken;

    const dispatch = useDispatch();


    useEffect(async () => {
        if (audit.auditDetails.sampling.sampledTransactions.length > 0) {
            console.log(audit)
            if (audit.auditDetails.sampling.sampledTransactions[0].xeroInvoiceId) {

                // TEMP SECTION FOR DEV WITHOUT NETWORK ==================================================
                console.log(sampleDetails)
                let newTransactions = []
                audit.auditDetails.sampling.sampledTransactions.forEach(transaction => {
                    let newTransaction = {
                        ...transaction
                    }
                    newTransaction['details'] = sampleDetails[0]

                    newTransactions.push(newTransaction)
                })
                dispatch(setAudit([audit.importData, audit.connectionType,
                audit.accounts, {
                    ...audit.auditDetails,
                    sampling: {
                        ...audit.auditDetails.sampling,
                        sampledTransactions: newTransactions,

                    }
                }]))



                // ====================================================================================================

                // const detailsUrl = process.env.REACT_APP_BACKEND_URL + "/audit/detailed-transactions"

                // const body = await createSamplingDetailsRequestBody();
                // console.log(body)
                // getToken(instance).then((jwt) => {

                //     axios.post(detailsUrl, body, {
                //         headers: {
                //             "Content-type": "application/json",
                //             'Authorization': `Bearer ${jwt}`
                //         }
                //     }).then((res) => {
                //         console.log(res)
                //     })
                // })

            }

        }
    }, [audit.accounts.selectedAccounts, refreshed])

    const createSamplingDetailsRequestBody = async () => {
        let body = {
            transactions: audit.auditDetails.sampling.sampledTransactions
        }
        console.log(audit)
        switch (audit.connectionType) {
            case 'xero':
                return await getExternalIntegrationRequest(body, 'xero');
            case 'file':
                return body; // adjust this if needed
            default:
                return body;
        }
    }

    const getExternalIntegrationRequest = async (body, type) => {

        if (type == 'xero') {

            const token = ValidateXeroAuth(GetCookie('XeroAuth'))

            const newBody = {
                ...body,
                externalRequest: {
                    token: await token,
                    connection: audit.importData.xero.connection
                }
            }
            console.log(newBody)

            return newBody;
        }

    }


    return (
        <div className='ml-5'>
            <div className=''>
                <PageHeader
                    title={"Sampling Details"}
                />
            </div>

            <div className="row justify-center">
                <div className="col-12 row">
                    <div className="col-12">
                        {isLoading ?
                            <Loader />
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
                                            {
                                                audit.auditDetails.sampling.sampledTransactions.length > 0 ?
                                                    <div>
                                                        {
                                                            audit.auditDetails.sampling.sampledTransactions.map((transaction) => {
                                                                console.log(transaction)
                                                                return (
                                                                    <div>
                                                                        <SampledTransactionDetail
                                                                            transaction={transaction}

                                                                        />
                                                                    </div>
                                                                )

                                                            })
                                                        }
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                            {/* <DataGrid
                                                rows={audit.auditDetails.sampling.sampledTransactions}
                                                columns={columns}
                                                autoHeight={true}

                                                pageSize={100}
                                            /> */}
                                        </div>
                                    </div>

                                    :
                                    <></>
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SamplingDetails