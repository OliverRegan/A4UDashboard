import React, { useEffect, useState } from 'react';
import '../components/topnav/topnav.css';
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-modal';
import Uploader from '../components/uploader/Uploader';

import { Formik, useFormik } from 'formik';
import {
    Button,
    TextField,
    Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setAudit } from '../redux/reducers/SaveAudit';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '40%',
        height: '20%',
        borderRadius: '1em',
        border: 'none',
        background: "#333",
        color: '#efefef'


    },
    overlay: {

        background: 'rgba(0, 0, 0, 0.92)'
    }
};


const Audits = (props) => {

    const [modalIsOpen, setIsOpen] = useState(false);
    // const [startDate, setStartDate] = useState(new Date());
    // const [message, setMessage] = useState(['', false]);
    const [files, setFiles] = useState()
    const [choice, setChoice] = useState();

    const dispatch = useDispatch()
    const audit = useSelector((state) => state.SaveAudit)

    Modal.setAppElement('body');

    const formik = useFormik({
        initialValues: {
            auditName: audit.auditDetails?.auditName != '' ? audit.auditDetails.auditName : '',
            clientName: audit.auditDetails?.clientName != '' ? audit.auditDetails.clientName : '',
            financialYear: audit.auditDetails?.financialYear != '' ? audit.auditDetails.financialYear : '',
        },
        onSubmit: values => {

            // Add data to redux store for current audit
            dispatch(setAudit([audit.file, audit.accounts, { ...audit.auditDetails, ...values }]))

        },
    });

    function closeModal() {
        setIsOpen(false);
    }

    function handleUpload(data) {
        // ID's for MUI
        let accounts = JSON.parse(data)
        accounts.forEach((account) => {
            account['id'] = accounts.indexOf(account)
        })

        // Pull needed file details
        let fileData = {
            fileName: files[0].file.name,
            fileSize: files[0].file.size,
        }


        dispatch(setAudit([fileData, accounts, audit.auditDetails]))
    }

    const openModal = (callback) => {
        setIsOpen(true)
        setChoice(() => callback)
    }
    async function checkRemove() {
        return new Promise((resolve, reject) => {
            openModal(userChoice => {
                if (userChoice === true) {
                    setIsOpen(false);
                    resolve(true);
                } else {
                    setIsOpen(false);
                    reject(false);
                }
            })
        })
    }
    async function validateFileRemoval() {
        return await checkRemove() ? dispatch(setAudit([{ fileName: '', fileSize: '' }, audit.accounts, audit.auditDetails])) : ''
    }
    async function validateAuditRemoval() {
        return await checkRemove() ? dispatch(setAudit([
            {
                fileName: '',
                fileSize: ''
            },
            [],
            {
                auditName: "",
                clientName: "",
                financialYear: "",
                selectedAccounts: [],
                sampledTransactions: [],
                searchedTransactions: [],
                recurringTransactions: []
            }])) : ''
    }

    function formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    return (
        <div>
            <div class=" w-full h-screen items-center justify-center bg-grey-lighter" className=''>
                <div className="card">
                    <div className="card__body">
                        {/* {files === {} ? */}
                        {files != {} ?
                            <div>
                                <div className='flex flex-col mx-auto w-1/2'>
                                    <div classname="flex justify-around my-3">
                                        <h1 className='text-center'>
                                            {audit.auditDetails.auditName === '' ? "New Audit" : audit.auditDetails.auditName}
                                        </h1>
                                    </div>
                                    <div className='flex justify-around my-3'>
                                        <div className='w-1/2 text-center'>
                                            <p className="p1 mx-auto">{audit.auditDetails.clientName === '' ? "Enter a client name" : audit.auditDetails.clientName}</p>
                                        </div>
                                        <div className='w-1/2 text-center'>
                                            <p className="p1 mx-auto">{audit.auditDetails.financialYear === "" ? "Enter a financial year" : audit.auditDetails.financialYear}</p>
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className='flex flex-col mx-auto w-1/2'>
                                        <TextField
                                            label="Audit Name"
                                            variant='standard'
                                            placeholder='Audit Name'
                                            sx={{
                                                my: "4px"
                                            }}
                                            id="auditName"
                                            name="auditName"
                                            type="text"
                                            onChange={formik.handleChange}
                                            value={formik.values.auditName}
                                        />
                                        <TextField
                                            label="Client Name"
                                            variant='standard'
                                            placeholder='Client Name'
                                            sx={{
                                                my: "4px"
                                            }}
                                            id="clientName"
                                            name="clientName"
                                            type="text"
                                            onChange={formik.handleChange}
                                            value={formik.values.clientName}
                                        />
                                        <TextField
                                            label="Financial Year"
                                            placeholder='Financial Year'
                                            variant='standard'
                                            sx={{
                                                my: "4px"
                                            }}
                                            id="financialYear"
                                            name="financialYear"
                                            type="text"
                                            onChange={formik.handleChange}
                                            value={formik.values.financialYear}
                                        />
                                        <Button
                                            type='submit'
                                            variant='contained'
                                            sx={{
                                                mt: '1rem',
                                                width: 1 / 2,
                                                mx: 'auto'
                                            }}>Save Details</Button>
                                    </div>
                                </form>
                            </div>
                            :
                            <div className='flex justify-center'>
                                <p>
                                    Please Upload a File First
                                </p>
                            </div>
                        }
                    </div>
                </div>
                {audit.file.fileName === "" ?
                    <Uploader
                        setFiles={setFiles}
                        clear={props.clear}
                        // validateFileRemoval={validateFileRemoval}
                        handleUpload={handleUpload}
                        setIsOpen={setIsOpen} />
                    :
                    <div className='card'>
                        <div className='card-body '>
                            <div className='w-100 text-center mb-8'>
                                <h2>Uploaded File</h2>
                            </div>
                            <div className='w-1/2 flex justify-around mx-auto'>
                                <div className='text-center w-1/2'>
                                    <h4 className='my-2'>File Name:</h4>
                                    <p>{audit.file.fileName}</p>
                                </div>
                                <div className='text-center w-1/2'>
                                    <h4 className='my-2'>File Size</h4>
                                    <p>{formatBytes(audit.file.fileSize, 0)}</p>
                                </div>
                            </div>
                            <div className=' flex justify-center'>
                                <Button
                                    onClick={validateFileRemoval}
                                    // onClick={}
                                    variant="contained"
                                    color='error'
                                    sx={{
                                        width: 1 / 4,
                                        mt: 4
                                    }}>Clear File</Button>
                            </div>

                        </div>
                    </div>}
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
            <Modal
                isOpen={modalIsOpen}
                // onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Loading..."
                shouldCloseOnOverlayClick={false}
            >
                <div className='mx-auto px-4 h-full flex flex-col justify-center'>
                    <div className='text-center'>Are you sure you want to remove your current audit?</div>
                    <div className='w-3/4 flex mx-auto justify-around mt-10'>
                        <Button
                            onClick={() => choice(true)}
                            variant="contained"
                            color='error'
                            sx={{
                                width: 2 / 5,

                            }}>Remove</Button>
                        <Button onClick={() => choice(false)}
                            variant="contained"
                            color='primary'
                            sx={{
                                width: 2 / 5,
                            }}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </div>

    )
}

export default Audits