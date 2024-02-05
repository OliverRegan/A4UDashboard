import { TextField, InputAdornment, Checkbox, Button, Switch } from "@mui/material";
import ExportBar from "../exportBar/Export";
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { setAudit } from "../../../redux/reducers/SaveAudit";
import { useSelector, useDispatch } from 'react-redux';
import useGetToken from "../../utility/Auth/useGetToken";
import { useMsal } from "@azure/msal-react";
import axios from 'axios';



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



const SamplingControls = ({ audit, clearSamples, setIsLoading, setRefreshed }) => {
    const dispatch = useDispatch()

    const { instance } = useMsal()
    const getToken = useGetToken;
    const [error, setError] = useState('')



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
            dispatch(setAudit([audit.importData, audit.accounts, { ...audit.auditDetails, sampling: { ...audit.auditDetails.sampling, ...values } }]))

            const transactionsUrl = process.env.REACT_APP_BACKEND_URL + "/audit/transactions"

            const body = {
                "BankAccounts": audit.auditDetails.accounts.selectedAccounts,
                "MaterialityIn": values.materiality === '' ? 0 : values.materiality,
                "DebitIn": values.debit === '' ? 0 : values.debit,
                "CreditIn": values.credit === '' ? 0 : values.credit,
                "SeedCode": values.seedInput === '' ? '0' : values.seedInput, // It needs to be a string and don't ask why
            }

            getToken(instance).then((jwt) => {
                console.log(jwt)
                axios.post(transactionsUrl, body, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        'Authorization': `Bearer ${jwt}`
                    }
                })
                    .then((res) => {
                        let response = res.data
                        console.log(response)
                        let transactions = []
                        response.transactions.forEach(transaction => {
                            let transNew = transaction
                            transNew.id = response.transactions.indexOf(transaction)
                            transactions.push(transNew)
                        })
                        let seedObj = getSeedObj(response.seedCode)
                        dispatch(setAudit([audit.importData, audit.accounts, {
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
            })
        },
    });
    function clearSamples() {
        dispatch(setAudit([audit.importData, audit.accounts, {
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
        setRefreshed(false)
        setTimeout(() => {
            setRefreshed(true) // force form refresh :)
        }, 2)
    }

    return (
        <>

            <div className="col-12">
                <form onSubmit={event => {
                    event.preventDefault();
                    formik.handleSubmit(event);
                }
                }>
                    <div className='grid grid-cols-4 mx-auto'>

                        <div className='col-span-2 col-start-1'>
                            <TextField
                                label="Credit Samples"
                                // variant='contained'
                                placeholder='Credit Samples'
                                disabled={formik.values.useSeed}
                                variant='standard'
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
                        <div className='col-span-2 flex flex-col col-start-3'>
                            <div className='text-right row grow justify-between px-3'>
                                <div className="flex flex-col justify-center">
                                    <p>Use Seed Code:</p>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <Switch sx={{}}
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
                        </div>

                        <div className='col-span-2 col-start-1'>
                            <TextField
                                label="Debit Samples"
                                // variant='contained'
                                placeholder='Debit Samples'
                                disabled={formik.values.useSeed}
                                variant='standard'
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
                        <div className='col-span-2 col-start-3'>
                            <TextField
                                label="Seed Code Input"
                                // variant='contained'
                                placeholder='Seed Code Input'
                                disabled={!formik.values.useSeed}
                                variant='standard'
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
                        <div className='col-span-2 col-start-1'>
                            <TextField
                                label="Materiality Input"
                                // variant='contained'
                                placeholder='Materiality Input'
                                disabled={formik.values.useSeed}
                                InputProps={formik.values.materiality != "" ? {
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                } : {}}
                                variant='standard'
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
                        <div className=' col-span-2 col-start-3 flex flex-col justify-center'>
                            <div className="flex justify-between">
                                <p>Seed Code:
                                </p>
                                <p>
                                    <span className='text-blue-500'> {audit.auditDetails.sampling.seed === "" ? "Nothing here yet" : audit.auditDetails.sampling.seed}</span>
                                </p>
                            </div>
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
                                }}>Clear</Button>
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




            </div>
        </>
    )
}

export default SamplingControls