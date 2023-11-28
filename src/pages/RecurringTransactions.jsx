import React, { useState, useEffect, useRef, useContext } from 'react'

import "./css/pages.css"
// Material UI
import {
    Typography,
    Box,
    Button,
    Checkbox,
    InputAdornment,
    Slider
} from "@mui/material"
import TextField from '@mui/material/TextField';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import dayjs from 'dayjs';

import { useSelector, useDispatch } from 'react-redux';

import { DataGrid } from '@mui/x-data-grid';
import columns from "../components/utility/GridDefinitions/TransactionColumns"

import TransactionModal from '../components/transactionModal/TransactionModal';
import AccountDetailsBar from '../components/accountDetailsBar/AccountDetailsBar';

import useGetToken from '../components/utility/Auth/useGetToken';
import { useMsal } from "@azure/msal-react";


import Axios from 'axios';

// Redux
import { setAudit } from '../redux/reducers/SaveAudit';

// Formik for searching
import { useFormik } from 'formik'


const RecurringTransactions = (props) => {

    const { instance } = useMsal()
    const getToken = useGetToken(instance);

    const audit = useSelector((state) => state.SaveAudit)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [alreadySearched, setAlreadySearched] = useState(false)
    const [err, setErr] = useState(false)
    const [startDateErr, setStartDateErr] = useState('')
    const [endDateErr, setEndDateErr] = useState('')
    const formRef = useRef(null);

    const formik = useFormik({
        initialValues: {
            endDate: audit.auditDetails.recurring.endDate === null ? null : dayjs(audit.auditDetails.recurring.endDate),
            endDateString: audit.auditDetails.recurring.endDateString === '' ? '' : audit.auditDetails.recurring.endDateString,
            startDate: audit.auditDetails.recurring.startDate === null ? null : dayjs(audit.auditDetails.recurring.startDate),
            startDateString: audit.auditDetails.recurring.startDateString === '' ? '' : audit.auditDetails.recurring.startDateString,
            minAmount: audit.auditDetails.recurring.minAmount === '' ? '' : audit.auditDetails.recurring.minAmount,
            maxAmount: audit.auditDetails.recurring.maxAmount === '' ? '' : audit.auditDetails.recurring.maxAmount,
            description: audit.auditDetails.recurring.description === '' ? '' : audit.auditDetails.recurring.description,
            daily: audit.auditDetails.recurring.recurrence.daily,
            weekly: audit.auditDetails.recurring.recurrence.weekly,
            monthly: audit.auditDetails.recurring.recurrence.monthly,
            quarterly: audit.auditDetails.recurring.recurrence.quarterly,
            biYearly: audit.auditDetails.recurring.recurrence.biYearly,
            yearly: audit.auditDetails.recurring.recurrence.yearly,
            credit: audit.auditDetails.recurring.type.credit,
            debit: audit.auditDetails.recurring.type.debit,
            useExact: audit.auditDetails.recurring.useExact,
            exactAmount: audit.auditDetails.recurring.exactAmount === '' ? '' : audit.auditDetails.recurring.exactAmount,
            percentage: audit.auditDetails.recurring.percentage === '' ? '' : audit.auditDetails.recurring.percentage,
        },
        onSubmit: values => {
            setLoading(true)
            let searchURL = process.env.REACT_APP_BACKEND_URL + "/audit/recurring-transactions"
            setLoading(true)
            let recurrence = {
                daily: values.daily,
                weekly: values.weekly,
                monthly: values.monthly,
                quarterly: values.quarterly,
                biYearly: values.biYearly,
                yearly: values.yearly
            }
            let body = {

                "BankAccounts": audit.auditDetails.accounts.selectedAccounts,
                "StartDate": values.startDateString != '' ? values.startDateString : '',
                "EndDate": values.endDateString != '' ? values.endDateString : '',
                "Description": values.description,
                "StartAmount": values.minAmount === '' ? 0 : values.minAmount,
                "EndAmount": values.maxAmount === '' ? 0 : values.maxAmount,
                "Debit": values.debit,
                "Credit": values.credit,
                "RecurrencePeriod": recurrence,
                "UseExact": values.useExact,
                "Percentage": values.percentage === '' ? 0 : values.percentage,
                "ExactAmount": values.exactAmount === '' ? 0 : values.exactAmount

            }
            getToken((jwt) => {
                Axios.post(searchURL, body, {
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    }
                })

                    .then((response) => {
                        console.log(response)
                        let recurringTransactions = [];
                        let identifierTransactions = [];
                        response.data.transactions.forEach(transaction => {
                            let transNew = transaction
                            let identifierNew = transNew[0]
                            transNew.id = response.data.transactions.indexOf(transaction)
                            identifierNew.id = response.data.transactions.indexOf(transaction)
                            recurringTransactions.push(transNew)
                            identifierTransactions.push(transNew[0])
                        })
                        dispatch(setAudit([audit.file, audit.accounts, {
                            ...audit.auditDetails,
                            recurring: {
                                ...audit.auditDetails.recurring,
                                ...values,
                                recurringTransactions: recurringTransactions,
                                identifierTransactions: identifierTransactions,
                                recurrence: {
                                    daily: values.daily,
                                    weekly: values.weekly,
                                    monthly: values.monthly,
                                    quarterly: values.quarterly,
                                    biYearly: values.biYearly,
                                    yearly: values.yearly
                                },
                                type: {
                                    credit: values.credit,
                                    debit: values.debit
                                },
                                endDate: (values.endDate != null ? values.endDate.toString() : values.endDate),
                                startDate: (values.startDate != null ? values.startDate.toString() : values.startDate),
                            }
                        }]))
                        setErr(false)
                        setLoading(false)
                    })

                    .catch((err) => {
                        setErr(true)
                        console.log(err)
                    })
            })

            setAlreadySearched(true)
        }
    })

    // States
    const [showModal, setShowModal] = useState(false)
    const [dataObj, setDataObj] = useState()

    async function handleEndDateChange(value) {
        // Check is valid
        if (dayjs(value).isValid()) {
            // Set date
            let date = new Date(value)
            let dateString = (date.getUTCDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
            formik.setFieldValue('endDate', value)
            formik.setFieldValue('endDateString', dateString)
            dispatch(setAudit([audit.file, audit.accounts, { ...audit.auditDetails, search: { ...audit.auditDetails.search, endDate: value.toString(), endDateString: dateString } }]))
            setEndDateErr('');
        } else if (value === null) {
            formik.setFieldValue('endDate', null)
            formik.setFieldValue('endDateString', '')
            dispatch(setAudit([audit.file, audit.accounts, { ...audit.auditDetails, search: { ...audit.auditDetails.search, endDate: '', endDateString: '' } }]))
            setEndDateErr('');
        } else {
            formik.setFieldValue('endDate', value)
            formik.setFieldValue('endDateString', value.toString())
            return setEndDateErr('End date must be valid');
        }
    }
    async function handleStartDateChange(value) {
        // Check is valid
        if (dayjs(value).isValid()) {
            // Set date
            let date = new Date(value)
            let dateString = (date.getUTCDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
            // setStartDate(value)
            // setStartDateString(dateString)
            formik.setFieldValue('startDate', value)
            formik.setFieldValue('startDateString', dateString)
            dispatch(setAudit([audit.file, audit.accounts, { ...audit.auditDetails, search: { ...audit.auditDetails.search, startDate: value.toString(), startDateString: dateString } }]))
            setStartDateErr('');
        } else if (value === null) {
            // setEndDate(value)
            // setEndDateString('')
            formik.setFieldValue('startDate', null)
            formik.setFieldValue('startDateString', '')
            dispatch(setAudit([audit.file, audit.accounts, { ...audit.auditDetails, search: { ...audit.auditDetails.search, startDate: '', startDateString: '' } }]))
            setStartDateErr('');
        } else {
            formik.setFieldValue('startDate', value)
            formik.setFieldValue('startDateString', value.toString())
            console.log(value)
            return setStartDateErr('Start date must be valid');
        }
    }
    function dateErrorFunc(type) {
        type === 'end' ? setEndDateErr('End date needs to be valid') : setStartDateErr('Start date needs to be valid')
        type === 'end' ? setTimeout(() => { setEndDateErr('') }, 3000) : setTimeout(() => { setStartDateErr('') }, 3000)
    }


    function clear() {
        setErr(false)
        setStartDateErr('')
        setEndDateErr('')
        dispatch(setAudit([audit.file, audit.accounts, {
            ...audit.auditDetails,
            recurring: {
                recurringTransactions: [],
                identifierTransactions: [],
                type: {
                    debit: false,
                    credit: false
                },
                recurrence: {
                    daily: false,
                    weekly: false,
                    monthly: false,
                    quarterly: false,
                    biYearly: false,
                    yearly: false
                },
                minAmount: '',
                maxAmount: '',
                startDateString: '',
                endDateString: '',
                startDate: null,
                endDate: null,
                description: '',
                useExact: false,
                exactAmount: '',
            }
        }]))
        formik.resetForm()
        setLoading(false)
    }

    return (
        <div className='ml-5'>
            <h2 className="page-header">
                Recurring Transactions
            </h2>
            {
                audit.auditDetails.accounts.selectedAccounts.length != 0 ?
                    <AccountDetailsBar />
                    :
                    <></>
            }
            <div className="col-12">
                <div className="card">
                    <div className="card__body">
                        {audit.auditDetails.accounts.selectedAccounts.length != 0 ?
                            <form onSubmit={formik.handleSubmit} ref={formRef}>
                                <div className='grid grid-cols-4 w-3/4 mx-auto'>
                                    <div className='col-span-4 text-red-500 text-center'>
                                        {
                                            startDateErr != '' || endDateErr != '' ?
                                                <div className='flex width-100 justify-around'>{startDateErr ? <Typography>{startDateErr} </Typography> : <></>}{endDateErr ? <Typography>{endDateErr}</Typography> : <></>}</div>

                                                :
                                                <></>
                                        }
                                    </div>
                                    <div className='col-span-4 flex justify-around my-3'>
                                        <Box sx={{
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                            <Typography>Daily</Typography>
                                            <Checkbox sx={{ mx: 'auto' }} checked={formik.values.daily} onClick={() => { formik.setFieldValue('daily', !formik.values.daily); console.log(formik.values) }} />
                                        </Box>
                                        <Box sx={{
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                            <Typography>Weekly</Typography>
                                            <Checkbox sx={{ mx: 'auto' }} checked={formik.values.weekly} onClick={() => formik.setFieldValue('weekly', !formik.values.weekly)} />
                                        </Box>
                                        <Box sx={{
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                            <Typography>Monthly</Typography>
                                            <Checkbox sx={{ mx: 'auto' }} checked={formik.values.monthly} onClick={() => formik.setFieldValue('monthly', !formik.values.monthly)} />
                                        </Box>
                                        <Box sx={{
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                            <Typography>Quarterly</Typography>
                                            <Checkbox sx={{ mx: 'auto' }} checked={formik.values.quarterly} onClick={() => formik.setFieldValue('quarterly', !formik.values.quarterly)} />
                                        </Box>
                                        <Box sx={{
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                            <Typography>Bi-Yearly</Typography>
                                            <Checkbox sx={{ mx: 'auto' }} checked={formik.values.biYearly} onClick={() => formik.setFieldValue('biYearly', !formik.values.biYearly)} />
                                        </Box>
                                        <Box sx={{
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                            <Typography>Yearly</Typography>
                                            <Checkbox sx={{ mx: 'auto' }} checked={formik.values.yearly} onClick={() => formik.setFieldValue('yearly', !formik.values.yearly)} />
                                        </Box>

                                    </div>
                                    <div className='col-span-4'>
                                        <TextField
                                            fullWidth
                                            name='description'
                                            label="Description"
                                            variant="filled"
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            size='small'
                                            sx={{
                                                my: "4px",
                                                width: 1
                                            }}
                                        />
                                    </div>
                                    <div className='col-span-2 col-start-2 flex justify-around my-4'>
                                        <Box sx={{
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                            <Typography>Debit</Typography>
                                            <Checkbox sx={{ mx: 'auto' }} checked={formik.values.debit} onClick={() => formik.setFieldValue('debit', !formik.values.debit)} />
                                        </Box>
                                        <Box sx={{
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                            <Typography>Credit</Typography>
                                            <Checkbox sx={{ mx: 'auto' }} checked={formik.values.credit} onClick={() => formik.setFieldValue('credit', !formik.values.credit)} />
                                        </Box>
                                    </div>


                                    <div className='col-span-2'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Box

                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    width: 1,
                                                    my: "4px"
                                                }}>
                                                <DesktopDatePicker
                                                    inputFormat="DD/MM/YYYY"
                                                    name="startDate"
                                                    onChange={handleStartDateChange}
                                                    value={formik.values.startDate}

                                                    renderInput={(params) => <TextField
                                                        {...params}
                                                        // inputProps={{ ...params.inputProps, readOnly: true }}
                                                        label="Start Date"

                                                        size="small"
                                                        variant="filled"
                                                    />}
                                                />
                                            </Box>

                                        </LocalizationProvider>
                                    </div>
                                    <div className='col-span-2'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                width: 1,
                                                my: "4px"
                                            }}>
                                                <DesktopDatePicker
                                                    inputFormat="DD/MM/YYYY"
                                                    onChange={handleEndDateChange}
                                                    value={formik.values.endDate}
                                                    clearable
                                                    name="endDate"
                                                    renderInput={(params) => <TextField
                                                        {...params}
                                                        // inputProps={{ ...params.inputProps, readOnly: true }}
                                                        label="End Date"
                                                        size="small"
                                                        variant="filled"
                                                    />}
                                                />
                                            </Box>
                                        </LocalizationProvider>
                                    </div>
                                    <div className='col-span-1 flex flex-col'>
                                        <div className='text-right row grow justify-around px-3'>
                                            <div className="flex flex-col justify-center">
                                                <p>Use Exact Value:</p>
                                            </div>

                                            <Checkbox sx={{}}
                                                checked={formik.values.useExact}
                                                onClick={() => {
                                                    formik.setFieldValue('useExact', !formik.values.useExact);
                                                    if (!formik.values.useExact) {
                                                        formik.setFieldValue('minAmount', '')
                                                        formik.setFieldValue('maxAmount', '')
                                                    } else {
                                                        formik.setFieldValue('exactAmount', '')
                                                        formik.setFieldValue('percentage', '')
                                                    }
                                                }} />

                                        </div>
                                    </div>

                                    <div className='col-span-1'>
                                        <TextField
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                            fullWidth
                                            name="exactAmount"
                                            disabled={!formik.values.useExact}
                                            label="Exact Amount"
                                            variant="filled" size='small'
                                            type={"number"}
                                            value={formik.values.exactAmount}
                                            onChange={formik.handleChange}
                                            sx={{
                                                my: "4px",
                                                width: 1
                                            }}
                                        />
                                    </div>

                                    <div className='col-span-2 col-start-3'>
                                        <TextField
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                            label="Minimum Amount"
                                            variant="filled"
                                            name="minAmount"
                                            disabled={formik.values.useExact}

                                            size='small'
                                            type={"number"}
                                            value={formik.values.minAmount}
                                            onChange={(formik.handleChange)}
                                            sx={{
                                                my: "4px",
                                                width: 1
                                            }}
                                        />
                                    </div>
                                    <div className='col-span-2 col-start-1'>
                                        <TextField
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                            }}
                                            fullWidth
                                            disabled={!formik.values.useExact}
                                            name="percentage"
                                            label="Percentage (+/-)"
                                            variant="filled" size='small'
                                            type={"number"}
                                            value={formik.values.percentage}
                                            onChange={formik.handleChange}
                                            sx={{
                                                my: "4px",
                                                width: 1,
                                            }}
                                        />
                                    </div>
                                    <div className='col-span-2 col-start-3'>
                                        <TextField
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                            fullWidth
                                            name="maxAmount"
                                            disabled={formik.values.useExact}

                                            label="Maximum Amount"
                                            variant="filled" size='small'
                                            type={"number"}
                                            value={formik.values.maxAmount}
                                            onChange={formik.handleChange}
                                            sx={{
                                                my: "4px",
                                                width: 1,
                                            }}
                                        />
                                    </div>

                                    <div className='col-span-2'>
                                        <Button variant='contained' color="success"
                                            disabled={startDateErr != '' || endDateErr != ''}
                                            sx={{
                                                mt: '1rem',
                                                mx: 'auto',
                                                width: 1
                                            }}
                                            onClick={() => {
                                                console.log(audit, formik)
                                                // Set formik values from state -> needed to do this way while using the dayjs localization provider
                                                if (formik.values.startDate != null && formik.values.startDate != '' && dayjs(formik.values.startDate).isValid()) {
                                                    setStartDateErr('')
                                                    formik.setFieldValue('startDateString', dayjs(formik.values.startDate).toString())
                                                } else if (formik.values.startDate === null) {
                                                    setStartDateErr('')
                                                    formik.setFieldValue('startDateString', '')
                                                } else {
                                                    return dateErrorFunc('start')
                                                }
                                                if (formik.values.endDate != null && formik.values.endDate != '' && dayjs(formik.values.endDate).isValid()) {
                                                    setEndDateErr('')
                                                    formik.setFieldValue('endDateString', dayjs(formik.values.endDate).toString())

                                                } else if (formik.values.endDate == null) {
                                                    setEndDateErr('')
                                                    formik.setFieldValue('endDateString', '')
                                                } else {
                                                    return dateErrorFunc('end')
                                                }
                                                if (startDateErr === '' && endDateErr === '') {
                                                    setErr(false)
                                                    formik.submitForm()
                                                } else {
                                                    setErr(true)

                                                }

                                            }}
                                        >Search</Button>
                                    </div>
                                    <div className='col-span-2'>
                                        <Button variant='contained'
                                            color="error" sx={{
                                                mt: '1rem',
                                                width: 1,
                                                mx: 'auto'
                                            }}
                                            onClick={() => {
                                                handleEndDateChange(null)
                                                handleStartDateChange(null)
                                                clear()
                                            }
                                            }
                                        >Clear</Button>
                                    </div>

                                </div>
                            </form>
                            :
                            <div className='my-20'>
                                <h2 className='text-center w-3/4 mx-auto'>
                                    You will be able to enter search terms once an audit has been uploaded
                                </h2>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <TransactionModal dataObj={dataObj} setDataObj={setDataObj} showModal={showModal} setShowModal={setShowModal} />
            {
                audit.auditDetails.accounts.selectedAccounts.length != 0 ?
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card__body">
                                    {audit.auditDetails.recurring.recurringTransactions.length != 0 ?
                                        // <Table
                                        //     // limit='10'
                                        //     headData={customerTableHead}
                                        //     renderHead={(item, index) => renderHead(item, index)}
                                        //     bodyData={transactions.length != 0 ? transactions : []}
                                        //     // renderBody={(item, index) => renderBody(item, index, props)}
                                        //     renderBody={(item, index) => renderBody(item, index, transactions)}

                                        // /
                                        <DataGrid
                                            rows={audit.auditDetails.recurring.identifierTransactions}
                                            columns={columns}
                                            autoHeight={true}
                                            pageSize={100}
                                            onRowClick={(val) => {
                                                setShowModal(true)
                                                console.log(val)
                                                setDataObj(audit.auditDetails.recurring.recurringTransactions[val.row.id])
                                            }}
                                        />

                                        :
                                        (
                                            loading ?
                                                <div className="flex justify-center my-4">
                                                    <div role="status">
                                                        <svg aria-hidden="true" class="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                :
                                                (alreadySearched && audit.auditDetails.recurring.identifierTransactions.length === 0 && !loading ?
                                                    <div className='my-20'>
                                                        <h2 className='text-center text-red'>
                                                            Nothing matches your search criteria.
                                                        </h2>
                                                    </div>
                                                    :
                                                    <div className='my-20'>
                                                        <h2 className='text-center'>
                                                            Click search to show relevant transactions.
                                                        </h2>
                                                    </div>
                                                )
                                        )

                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    : <></>
            }
        </div >
    )
}

export default RecurringTransactions
