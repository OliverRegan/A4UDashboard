import React, { useState, useEffect } from 'react'
import "./css/pages.css"

// Material UI
import {
    Typography,
    Box,
    TextField,
    InputLabel,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox
} from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import dayjs from 'dayjs';

import Table from '../components/table/Table'
import TransactionModal from '../components/transactionModal/TransactionModal';

import Axios from 'axios';


// Formik for searching
import { Form, Formik, useFormik } from 'formik'
import valuesRecurring from '../components/utility/Formik/Search/DefaultValues'
import validationSchema from '../components/utility/Formik/Search/validationSchema'
import { Label, ListAlt } from '@mui/icons-material';
import { green } from '@mui/material/colors';


const RecurringTransactions = (props) => {

    // Set variable for forcing rerender on selection of account
    const [render, setRender] = useState(0); // Check 

    // Transactions to be received
    const [transactions, setTransactions] = useState([])

    // States
    const [alreadySearched, setAlreadySearched] = useState(false)
    const [endDate, setEndDate] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDateString, setEndDateString] = useState(null)
    const [startDateString, setStartDateString] = useState(null)
    const [daily, setDaily] = useState(false)
    const [weekly, setWeekly] = useState(false)
    const [monthly, setMonthly] = useState(false)
    const [quarterly, setQuarterly] = useState(false)
    const [biYearly, setBiYearly] = useState(false)
    const [yearly, setYearly] = useState(false)
    const [debitType, setDebitType] = useState(false)
    const [creditType, setCreditType] = useState(false)
    const [dateErr, setDateErr] = useState('')
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [dataObj, setDataObj] = useState()


    useEffect(() => {
        setRender(1)
        setRender(0)
    }, [transactions, endDate, startDate])


    function getRecurring(formikValues) {
        setLoading(true)
        setTransactions(() => [])
        let searchURL = process.env.REACT_APP_BACKEND_URL + "/audit/recurring-transactions"
        let recurrencePeriod = {
            "Daily": daily,
            "Weekly": weekly,
            "Monthly": monthly,
            "Quarterly": quarterly,
            "BiYearly": biYearly,
            "Yearly": yearly
        }
        let body = {

            "BankAccounts": props.audit,
            "StartDate": startDateString != null ? startDateString : '',
            "EndDate": endDateString != null ? endDateString : '',
            "Description": formikValues.description,
            "StartAmount": formikValues.startAmount === '' ? 0 : formikValues.startAmount,
            "EndAmount": formikValues.endAmount === '' ? 0 : formikValues.endAmount,
            "Debit": debitType,
            "Credit": creditType,
            "RecurrencePeriod": recurrencePeriod,

        }
        setEndDate(null)
        setStartDate(null)
        setEndDateString(null)
        setStartDateString(null)
        setAlreadySearched(false)
        setTransactions([])
        Axios.post(searchURL, body)
            .then((response) => {
                setTransactions([])
                let sampledTransactions = [];
                for (let i = 0; i < response.data.transactions.length; i++) {
                    sampledTransactions.push(response.data.transactions[i]);
                }
                console.log(sampledTransactions)
                setTransactions(() => sampledTransactions)
                setAlreadySearched(true)
                setLoading(false)
            })
            .catch((err) => {
                setAlreadySearched(true)
            })
    }

    function handleEndDateChange(value) {
        console.log(value)
        // Check is valid
        if (value == null) {
            console.log(value, 'test')
            setEndDate(value)
            setEndDateString('')
            setDateErr('');
        } else if (dayjs(value).isValid()) {
            // Set date

            let date = new Date(value)
            let dateString = (date.getUTCDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
            setEndDate(value)
            setEndDateString(dateString)
            setDateErr('');
        } else {
            return setDateErr('End date must be valid');
        }
    }
    function handleStartDateChange(value) {
        console.log(value)
        // Check is valid
        if (value == null) {
            setStartDate(value)
            setStartDateString('')
            setDateErr('');
        } else if (dayjs(value).isValid()) {
            // Set date
            let date = new Date(value)
            let dateString = (date.getUTCDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
            setStartDate(value)
            setStartDateString(dateString)
            setDateErr('');
        } else {
            return setDateErr('Start date must be valid');
        }
    }

    function dateErrorFunc() {
        setDateErr('Date needs to be valid')
        setTimeout(() => { setDateErr('') }, 3000)
    }

    function changeRecurrence(type) {
        switch (type) {
            case 'daily':
                setDaily(!daily)
                break;
            case 'weekly':
                setWeekly(!weekly)
                break;
            case 'monthly':
                setMonthly(!monthly)
                break;
            case 'quarterly':
                setQuarterly(!quarterly)
                break;
            case 'biYearly':
                setBiYearly(!biYearly)
                break;
            case 'yearly':
                setYearly(!yearly)
                break;
            default:
        }
    }


    const customerTableHead = [
        "Details",
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

    const renderBody = (item, index, transactions) => (
        <tr key={index}>
            <td>
                <Button
                    className='show-details-button'
                    onClick={() => {
                        setShowModal(true);
                        setDataObj(item)
                    }}
                >
                    <ListAlt className='text-grey' />
                </Button>
            </td>
            <td>{parseInt(item[0].debit) == 0 ? "Credit" : "Debit"}</td>
            <td>{item[0].accountNum}</td>
            <td>{item[0].accountName}</td>
            <td>{item[0].externalId}</td>
            <td>{item[0].source}</td>
            <td>-</td>
            <td>{item[0].description}</td>
            <td>{parseInt(item[0].debit) == 0 ? item[0].credit : item[0].debit}</td>
        </tr>

    )

    return (
        <div {...render}>

            <h2 className="page-header">
                Recurring Transactions
            </h2>
            <div className='mb-3 max-w-lg mx-auto'>
                <div className="card">
                    <div className="card__body">
                        <div className="items-center justify-center">
                            {props.audit != null ?
                                <Formik
                                    initialValues={valuesRecurring}
                                    onSubmit={(values, actions) => { }}
                                    validationSchema={validationSchema}
                                >
                                    {props => (
                                        <Form>
                                            <Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-around',
                                                    gap: 3
                                                }}>
                                                    <Box sx={{
                                                        justifyContent: 'center',
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography>Daily</Typography>
                                                        <Checkbox sx={{ mx: 'auto' }} checked={daily} onClick={() => changeRecurrence('daily')} />
                                                    </Box>
                                                    <Box sx={{
                                                        justifyContent: 'center',
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography>Weekly</Typography>
                                                        <Checkbox sx={{ mx: 'auto' }} checked={weekly} onClick={() => changeRecurrence('weekly')} />
                                                    </Box>
                                                    <Box sx={{
                                                        justifyContent: 'center',
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography>Monthly</Typography>
                                                        <Checkbox sx={{ mx: 'auto' }} checked={monthly} onClick={() => changeRecurrence('monthly')} />
                                                    </Box>
                                                    <Box sx={{
                                                        justifyContent: 'center',
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography>Quarterly</Typography>
                                                        <Checkbox sx={{ mx: 'auto' }} checked={quarterly} onClick={() => changeRecurrence('quarterly')} />
                                                    </Box>
                                                    <Box sx={{
                                                        justifyContent: 'center',
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography>Bi-Yearly</Typography>
                                                        <Checkbox sx={{ mx: 'auto' }} checked={biYearly} onClick={() => changeRecurrence('biYearly')} />
                                                    </Box>
                                                    <Box sx={{
                                                        justifyContent: 'center',
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography>Yearly</Typography>
                                                        <Checkbox sx={{ mx: 'auto' }} checked={yearly} onClick={() => changeRecurrence('yearly')} />
                                                    </Box>

                                                </Box>

                                                <Box sx={{
                                                    mb: 2
                                                }}>
                                                    <Box sx={{
                                                        color: 'red',
                                                        width: 1,
                                                        display: 'flex',
                                                        justifyContent: 'center'
                                                    }}>
                                                        {
                                                            dateErr != '' ?
                                                                <Typography>

                                                                    {dateErr}

                                                                </Typography>
                                                                :
                                                                <></>
                                                        }
                                                    </Box>


                                                    <InputLabel>Description</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        placeholder='Transaction description contains'
                                                        name='description'
                                                        value={props.values.description}
                                                        onChange={props.handleChange}
                                                        variant="outlined"
                                                        size='small'
                                                    />
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-around',
                                                    gap: 3
                                                }}>
                                                    <Box sx={{
                                                        justifyContent: 'center',
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography>Debit</Typography>
                                                        <Checkbox sx={{ mx: 'auto' }} checked={debitType} onClick={() => setDebitType(!debitType)} />
                                                    </Box>
                                                    <Box sx={{
                                                        justifyContent: 'center',
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography>Credit</Typography>
                                                        <Checkbox sx={{ mx: 'auto' }} checked={creditType} onClick={() => setCreditType(!creditType)} />
                                                    </Box>
                                                </Box>

                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    gap: 3
                                                }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 3,
                                                        width: 1

                                                    }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <Box

                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    width: 1
                                                                }}>
                                                                <InputLabel>Start Date</InputLabel>
                                                                <DesktopDatePicker
                                                                    inputFormat="DD/MM/YYYY"
                                                                    name="startDate"
                                                                    onChange={handleStartDateChange}
                                                                    value={startDate}
                                                                    renderInput={(params) => <TextField
                                                                        {...params}
                                                                        size="small"
                                                                    />}
                                                                />
                                                            </Box>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column'
                                                            }}>
                                                                <InputLabel>End Date</InputLabel>
                                                                <DesktopDatePicker
                                                                    inputFormat="DD/MM/YYYY"
                                                                    name="endDate"
                                                                    onChange={handleEndDateChange}
                                                                    value={endDate}
                                                                    renderInput={(params) => <TextField
                                                                        {...params}
                                                                        size="small"
                                                                    />}
                                                                />
                                                            </Box>
                                                        </LocalizationProvider>

                                                    </Box>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 3,
                                                        width: 1

                                                    }}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column'
                                                        }}>
                                                            <InputLabel>Minimum Amount</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                placeholder="Minimum amount of transaction"
                                                                name="startAmount"
                                                                variant="outlined"
                                                                size='small'
                                                                type={"number"}
                                                                value={props.values.startAmount}
                                                                onChange={props.handleChange}
                                                            />
                                                        </Box>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column'
                                                        }}>
                                                            <InputLabel>Maximum Amount</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                name="endAmount"
                                                                placeholder="Maximum amount of transaction"
                                                                variant="outlined"
                                                                size='small'
                                                                type={"number"}
                                                                value={props.values.endAmount}
                                                                onChange={props.handleChange}

                                                            />

                                                        </Box>
                                                    </Box>

                                                </Box>

                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-around',
                                                    mt: 3,
                                                    gap: 3
                                                }}>
                                                    <Button variant='contained' color="success"
                                                        disabled={dateErr != ''}
                                                        sx={{
                                                            width: 1 / 2,

                                                        }}
                                                        onClick={() => {
                                                            // Set formik values from state -> needed to do this way while using the dayjs localization provider
                                                            if (startDate != null && startDate != '' && dayjs(startDate).isValid()) {
                                                                setDateErr('')
                                                                props.setFieldValue('startDate', dayjs(startDate).toString())
                                                            } else if (startDate == null) {
                                                                // Do nothing
                                                            } else {
                                                                console.log(startDate)

                                                                return dateErrorFunc()
                                                            }
                                                            if (endDate != null && endDate != '' && dayjs(endDate).isValid()) {
                                                                setDateErr('')
                                                                props.setFieldValue('endDate', dayjs(endDate).toString())

                                                            } else if (endDate == null) {
                                                                // Do nothing
                                                            } else {
                                                                return dateErrorFunc()
                                                            }
                                                            if (dateErr === '') {
                                                                getRecurring(props.values)
                                                                setErr(false)
                                                            } else {
                                                                setErr(true)
                                                            }

                                                        }}
                                                    >Search</Button>
                                                    <Button variant='contained' color="error" sx={{
                                                        width: 1 / 2
                                                    }}
                                                        onClick={() => {
                                                            setEndDate(null)
                                                            setStartDate(null)
                                                            setEndDateString(null)
                                                            setStartDateString(null)
                                                            setAlreadySearched(false)
                                                            setTransactions([])
                                                            props.handleReset()
                                                        }}
                                                    >Clear</Button>

                                                </Box>

                                            </Box>
                                        </Form>)}
                                </Formik>
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
            </div>
            <TransactionModal dataObj={dataObj} setDataObj={setDataObj} showModal={showModal} setShowModal={setShowModal} />
            {
                props.audit != null ?
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card__body">
                                    {/* {transactions.length != 0 ? */}
                                    {transactions.length != 0 ?
                                        <Table
                                            // limit='10'
                                            headData={customerTableHead}
                                            renderHead={(item, index) => renderHead(item, index)}
                                            bodyData={transactions.length != 0 ? transactions : []}
                                            // renderBody={(item, index) => renderBody(item, index, props)}
                                            renderBody={(item, index) => renderBody(item, index, transactions)}

                                        />
                                        :
                                        (
                                            loading ?
                                                <div className='my-20'>
                                                    <h2 className='text-center'>
                                                        Please wait, loading recurring transactions...
                                                    </h2>
                                                </div>
                                                :
                                                (alreadySearched && transactions.length === 0 && !loading ?
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
