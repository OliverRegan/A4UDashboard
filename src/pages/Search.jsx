import React, { useState, useEffect } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'

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

import dayjs from 'dayjs';

import Table from '../components/table/Table'

import Axios from 'axios';


// Formik for searching
import { Form, Formik, useFormik } from 'formik'
import values from '../components/utility/Formik/Search/DefaultValues'
import validationSchema from '../components/utility/Formik/Search/validationSchema'


const Search = (props) => {

    // Set variable for forcing rerender on selection of account
    const [render, setRender] = useState(0); // Check


    // Search array for resultint transactions
    const [search, setSearch] = useState([])


    // URL
    const searchURL = process.env.REACT_APP_BACKEND_URL + "/audit/search"

    // Initial values that cannot be defined in Yup
    const [endDate, setEndDate] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDateString, setEndDateString] = useState(null)
    const [startDateString, setStartDateString] = useState(null)

    // Transactions to be received
    const [transactions, setTransactions] = useState([])


    useEffect(() => {

    }, [])


    async function handleEndDateChange(value) {
        // Check is valid
        if (dayjs(value).isValid()) {
            // Set date
            console.log('hei')

            let date = new Date(value)
            let dateString = (date.getUTCDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
            setEndDate(value)
            setEndDateString(dateString)
            console.log(dateString)
        }
    }
    async function handleStartDateChange(value) {
        // Check is valid
        if (dayjs(value).isValid()) {
            // Set date


            let date = new Date(value)
            let dateString = (date.getUTCDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
            setStartDate(value)
            setStartDateString(dateString)
            console.log(dateString)
        }
    }

    async function handleSearch(formikValues) {



        let body = {

            "BankAccounts": props.audit,
            "Description": formikValues.description,
            "StartDate": startDateString != null ? startDateString : '',
            "EndDate": endDateString != null ? endDateString : '',
            "StartAmount": formikValues.startAmount === '' ? 0 : formikValues.startAmount,
            "EndAmount": formikValues.endAmount === '' ? 0 : formikValues.endAmount,

        }
        await Axios.post(searchURL, body)
            .then((response) => {
                console.log(response)

                setTransactions([])
                let sampledTransactions = [];
                for (let i = 0; i < response.data.transactions.length; i++) {
                    sampledTransactions.push(response.data.transactions[i]);
                }
                setTransactions(() => sampledTransactions)
            })
            .catch((err) => {

            })


        console.log(transactions, "sdsds")

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
        <div {...render}>

            <h2 className="page-header">
                Search Transactions
            </h2>
            <div className='mb-3 max-w-lg mx-auto'>
                <div className="card">
                    <div className="card__body">
                        <div className="items-center justify-center">
                            {props.audit != null ?
                                <Formik
                                    initialValues={values}
                                    onSubmit={(values, actions) => { }}
                                    validationSchema={validationSchema}
                                >
                                    {props => (
                                        <Form>
                                            <Box sx={{
                                                mb: 2
                                            }}>
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
                                            {/* Buttons */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-around',
                                                mt: 3,
                                                gap: 3
                                            }}>
                                                <Button variant='contained' color="success" sx={{
                                                    width: 1 / 2
                                                }}
                                                    onClick={() => {
                                                        // Set formik values from state -> needed to do this way while using the dayjs localization provider
                                                        props.setFieldValue('startDate', dayjs(startDate).toString())
                                                        props.setFieldValue('endDate', dayjs(endDate).toString())
                                                        handleSearch(props.values)
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
            {props.audit != null ?
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card__body">
                                {transactions.length != 0 ?
                                    <Table
                                        // limit='10'
                                        headData={customerTableHead}
                                        renderHead={(item, index) => renderHead(item, index)}
                                        bodyData={transactions.length != 0 ? transactions : []}
                                        renderBody={(item, index) => renderBody(item, index, props)}

                                    />
                                    :
                                    <div className='my-20'>
                                        <h2 className='text-center'>
                                            Click search to show relevant transactions.
                                        </h2>
                                    </div>
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
