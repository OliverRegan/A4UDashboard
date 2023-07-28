import React, { useState, useEffect } from 'react'

// Material UI
import {
    Typography,
    Box,
    TextField,
    InputLabel,
    Button
} from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs';
import Table from '../components/table/Table'
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
// Formik for searching
import { Form, Formik, useFormik } from 'formik'
import values from '../components/utility/Formik/Search/DefaultValues'
import validationSchema from '../components/utility/Formik/Search/validationSchema'
import { setAudit } from '../redux/reducers/SaveAudit';


const Search = (props) => {

    const audit = useSelector((state) => state.SaveAudit)
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)

    // URL
    const searchURL = process.env.REACT_APP_BACKEND_URL + "/audit/search"

    // Initial values that cannot be defined in Yup
    const [endDate, setEndDate] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDateString, setEndDateString] = useState(null)
    const [startDateString, setStartDateString] = useState(null)
    const [err, setErr] = useState(false)
    const [dateErr, setDateErr] = useState('')

    // For checking if search already done
    const [alreadySearched, setAlreadySearched] = useState(false);

    // Transactions to be received
    const [transactions, setTransactions] = useState([])

    const formik = useFormik({
        initialValues: {
            minAmount: audit.auditDetails?.search.minAmount != '' ? audit.auditDetails.search.minAmount : '',
            maxAmount: audit.auditDetails?.search.maxAmount != '' ? audit.auditDetails.search.maxAmount : '',
            startDate: audit.auditDetails?.search.startDate != '' ? audit.auditDetails.search.startDate : null,
            endDate: audit.auditDetails?.search.endDate != '' ? audit.auditDetails.search.endDate : null,
            startDateVal: audit.auditDetails?.search.startDateVal != '' ? audit.auditDetails.search.startDateVal : null,
            endDateVal: audit.auditDetails?.search.endDateVal != '' ? audit.auditDetails.search.endDateVal : null,
            description: audit.auditDetails?.search.description != '' ? audit.auditDetails.search.description : '',

        },
        onSubmit: values => {
            setIsLoading(true);
            dispatch(setAudit([audit.file, audit.accounts, { ...audit.auditDetails, search: { ...audit.auditDetails.search, ...values } }]))
            let body = {

                "BankAccounts": audit.auditDetails.accounts.selectedAccounts,
                "Description": values.description,
                "StartDate": values.startDate,
                "EndDate": values.endDate,
                "StartAmount": values.minAmount === '' ? 0 : values.minAmount,
                "EndAmount": values.maxAmount === '' ? 0 : values.maxAmount,

            }
            Axios.post(searchURL, body)
                .then((response) => {
                    console.log(response)
                    setTransactions([])
                    let sampledTransactions = [];
                    for (let i = 0; i < response.data.transactions.length; i++) {
                        sampledTransactions.push(response.data.transactions[i]);
                    }
                    setTransactions(() => sampledTransactions)
                    setAlreadySearched(true)
                    console.log(props.audit)
                })
                .catch((err) => {
                    setAlreadySearched(true)
                    console.log(err)
                })
        }
    })

    async function handleEndDateChange(formik, value) {
        // Check is valid
        if (dayjs(value).isValid()) {
            // Set date
            let date = new Date(value)
            let dateString = (date.getUTCDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
            formik.setFieldValue('endDate', dateString)
            formik.setFieldValue('endDateVal', value)
            setDateErr('');
        } else if (value === null) {
            formik.setFieldValue('endDate', '')
            formik.setFieldValue('endDateVal', value)
            setDateErr('');
        } else {
            return setDateErr('End date must be valid');
        }
    }
    async function handleStartDateChange(formik, value) {
        console.log(value, formik)
        // Check is valid
        if (dayjs(value).isValid()) {
            // Set date
            let date = new Date(value)
            let dateString = (date.getUTCDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
            formik.setFieldValue('startDate', dateString)
            formik.setFieldValue('startDateVal', value)
            setDateErr('');
        } else if (value === null) {
            formik.setFieldValue('startDate', '')
            formik.setFieldValue('startDateVal', value)
            setDateErr('');
        } else {
            return setDateErr('Start date must be valid');
        }
    }
    function clearSearch() {
        setEndDate(null)
        setStartDate(null)
        setEndDateString(null)
        setStartDateString(null)
        setAlreadySearched(false)
        setTransactions([])
        dispatch(setAudit([audit.file, audit.accounts, {
            ...audit.auditDetails,
            search: {
                searchedTransactions: [],
                minAmount: '',
                maxAmount: '',
                startDate: '',
                endDate: '',
            }
        }]))
    }


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

    function dateErrorFunc() {
        setDateErr('Date needs to be valid')
        setTimeout(() => { setDateErr('') }, 3000)
    }

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

    return (
        <div>

            <h2 className="page-header">
                Search Transactions
            </h2>
            <div className='mb-3 max-w-lg mx-auto'>
                <div className="card">
                    <div className="card__body">
                        <div className="items-center justify-center">
                            {audit.auditDetails.accounts.selectedAccounts.length != 0 ?
                                <Formik
                                    initialValues={values}
                                    onSubmit={formik.handleSubmit}
                                // validationSchema={validationSchema}
                                >
                                    {props => (
                                        <Form>
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
                                                                onChange={(val) => handleStartDateChange(props, val)}
                                                                value={props.values.startDateVal}
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
                                                                onChange={(val) => handleEndDateChange(props, val)}
                                                                value={props.values.endDateVal}
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
                                                            name="minAmount"
                                                            variant="outlined"
                                                            size='small'
                                                            type={"number"}
                                                            value={props.values.minAmount}
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
                                                            name="maxAmount"
                                                            placeholder="Maximum amount of transaction"
                                                            variant="outlined"
                                                            size='small'
                                                            type={"number"}
                                                            value={props.values.maxAmount}
                                                            onChange={props.handleChange}
                                                        />

                                                    </Box>
                                                </Box>

                                            </Box>
                                            {/* Buttons */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-around',
                                                mt: 3,
                                                gap: 3
                                            }}>
                                                <Button variant='contained' color="success"
                                                    disabled={dateErr != ''}
                                                    sx={{
                                                        width: 1 / 2
                                                    }}
                                                    type='submit'
                                                // onClick={() => {
                                                //     // Set formik values from state -> needed to do this way while using the dayjs localization provider
                                                //     if (startDate != null && startDate != '' && dayjs(startDate).isValid()) {
                                                //         setDateErr('')
                                                //         props.setFieldValue('startDate', dayjs(startDate).toString())
                                                //     } else if (startDate === null) {
                                                //         // Do nothing
                                                //     } else {
                                                //         return dateErrorFunc()
                                                //     }
                                                //     if (endDate != null && endDate != '' && dayjs(endDate).isValid()) {
                                                //         setDateErr('')
                                                //         props.setFieldValue('endDate', dayjs(endDate).toString())

                                                //     } else if (endDate == null) {
                                                //         // Do nothing
                                                //     } else {
                                                //         return dateErrorFunc()
                                                //     }
                                                //     if (dateErr === '') {
                                                //         setErr(true)
                                                //         handleSearch(props.values)
                                                //     } else {
                                                //         setErr(false)
                                                //     }

                                                // }}
                                                >Search</Button>
                                                <Button variant='contained' color="error" sx={{
                                                    width: 1 / 2
                                                }}
                                                    onClick={() => {
                                                        clearSearch()
                                                        props.handleReset()
                                                    }
                                                    }
                                                >Clear</Button>

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
            {audit.auditDetails.search != null ?
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card__body">
                                {audit.auditDetails.search.searchedTransactions.length != 0 ?
                                    <Table
                                        // limit='10'
                                        headData={customerTableHead}
                                        renderHead={(item, index) => renderHead(item, index)}
                                        bodyData={transactions.length != 0 ? transactions : []}
                                        renderBody={(item, index) => renderBody(item, index, props)}

                                    />
                                    :
                                    (alreadySearched && audit.auditDetails.search.searchedTransactions.length === 0 ?
                                        <div className='my-20'>
                                            <h2 className='text-center'>
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

                                }

                            </div>
                        </div>
                    </div>
                </div>
                : <></>}
        </div >
    )
}

export default Search
