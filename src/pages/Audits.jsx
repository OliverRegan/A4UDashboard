import React, { useEffect, useState } from 'react';
import '../components/topnav/topnav.css';
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-modal';
import Uploader from '../components/uploader/Uploader';

import { Formik, useFormik } from 'formik';
import {
    Button,
    TextField
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
            auditName: audit.auditDetails?.auditName == '' ? audit.auditDetails.auditName : '',
            clientName: audit.auditDetails?.clientName == '' ? audit.auditDetails.clientName : '',
            financialYear: audit.auditDetails?.financialYear == '' ? audit.auditDetails.financialYear : '',
        },
        onSubmit: values => {
            // Add data to redux store for current audit
            dispatch(setAudit([audit.file, audit.accounts, values, audit.audit]))

        },
    });

    function closeModal() {
        setIsOpen(false);
    }

    function handleUpload(data) {
        dispatch(setAudit([files, JSON.parse(data)]))
    }

    const openModal = (callback) => {
        setIsOpen(true)
        setChoice(() => callback)
    }
    function validateFileRemoval() {
        return new Promise((resolve, reject) => {
            openModal(userChoice => {
                if (userChoice === true) {
                    resolve(true);
                } else {
                    reject(false);
                }
            })
        })
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
                                            {formik.values.auditName === '' ? "New Audit" : formik.values.auditName}
                                        </h1>
                                    </div>
                                    <div className='flex justify-around my-3'>
                                        <p className="p1">{formik.values.clientName === '' ? "Enter a client name" : formik.values.clientName}</p>
                                        <p className="p1">{formik.values.financialYear === "" ? "Enter a financail year" : formik.values.financialYear}</p>
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
                {/* <div className="topnav__search">
                    <input type="text" placeholder='' />
                    <i className='bx bx-search'></i>
                </div><br /> */}
                <Uploader
                    setFiles={setFiles}
                    clear={props.clear}
                    validateFileRemoval={validateFileRemoval}
                    handleUpload={handleUpload}
                    setIsOpen={setIsOpen} />
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