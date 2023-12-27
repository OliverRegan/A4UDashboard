import React, { useEffect, useState } from 'react';

import '../components/topnav/topnav.css';
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-modal';


import { useFormik } from 'formik';
import {
    Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setAudit } from '../redux/reducers/SaveAudit';

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

import { useMsal } from '@azure/msal-react';
import XeroImport from '../components/Xero/GetXeroToken/GetXeroToken';
import AuditDetails from '../components/AuditsPageComponents/auditDetails/AuditDetails';
import FileUploader from '../components/AuditsPageComponents/upload/FileUploader';
import StepIndicator from '../components/Shared/StepIndicator/StepIndicator';
import UploadSelector from '../components/SamplingComponents/UploadSelector/UploadSelector';
import { useLocation } from 'react-router-dom';

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

const stepList = [
    {
        step: 1,
        name: "Upload Data"
    },
    {
        step: 2,
        name: "Input Details"
    },
    {
        step: 3,
        name: "Select Columns"
    }
]

const Audits = (props) => {

    const [modalIsOpen, setIsOpen] = useState(false);

    const [choice, setChoice] = useState();
    const dispatch = useDispatch()
    const audit = useSelector((state) => state.SaveAudit)
    const [file, setFile] = useState(audit.file)
    const [uploadType, setUploadType] = useState("");
    const [step, setStep] = useState(1)
    const [completedStep, setCompletedStep] = useState()
    const { instance } = useMsal()
    const profile = instance.getActiveAccount()

    const location = useLocation();

    useEffect(() => {
        let params = new URLSearchParams(location.search);
        if (params.get("xeroAuthRedirect") == "true") {
            setUploadType("xero")
        }
    }, [])

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

    const openModal = (callback) => {
        setIsOpen(true)
        setChoice(() => callback)
    }


    async function validateFileRemoval() {
        return await checkRemove() ? dispatch(setAudit([{ fileName: '', fileSize: '' }, [], audit.auditDetails])) : ''
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


    function dispatchAudit(response) {
        let data = response.data

        // props.handleUpload(res);
        let accounts = data.accounts
        accounts.forEach((account) => {
            account['id'] = accounts.indexOf(account)
        })
        // Pull needed file details
        let fileData = {
            fileName: data.fileName,
            fileSize: data.fileSize
        }

        dispatch(setAudit([fileData, accounts, {
            auditName: "",
            clientName: "",
            financialYear: "",
            auditor: {
                name: profile.name
            },
            accounts: {
                population: '',
                selectedAccounts: [],
                transactionNum: '',
                creditAmount: '',
                debitAmount: ''
            },
            sampling: {
                sampledTransactions: [],
                useSeed: false,
                credit: '',
                debit: '',
                materiality: '',
                seedInput: '',
                seed: '',
                sampleInterval: '',
                samplePercentage: ''
            },
            search: {
                searchedTransactions: [],
                type: {
                    debit: false,
                    credit: false
                },
                minAmount: '',
                maxAmount: '',
                startDateString: '',
                endDateString: '',
                startDate: null,
                endDate: null,
                description: '',
            },
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
                percentage: ''
            }
        }]))
    }


    return (
        <div>
            <div className=" h-screen items-center justify-center bg-grey-lighter w-1/2 mx-auto" >
                <div className="card">
                    <div className="card__body">
                        <StepIndicator step={step}
                            setStep={setStep}
                            stepList={stepList}
                            setCompletedStep={setCompletedStep}
                            completedStep={completedStep} />
                    </div>
                </div>
                <div className="card">
                    <div className="card__body">

                        {
                            step === 1 ?

                                <UploadSelector
                                    setUploadType={setUploadType}
                                    uploadType={uploadType}
                                />

                                :
                                <></>
                        }
                        {
                            step === 1 && uploadType != "" ?
                                <div className='mt-10'>
                                    {
                                        uploadType === "file" ?
                                            <FileUploader
                                                audit={audit}
                                                dispatchAudit={dispatchAudit}
                                                openModal={openModal}
                                                closeModal={closeModal}
                                                validateFileRemoval={validateFileRemoval}
                                                checkRemove={checkRemove}
                                            />
                                            :
                                            <></>
                                    }
                                    {
                                        uploadType === "xero" ?
                                            <XeroImport dispatchAudit={dispatchAudit} openModal={openModal} closeModal={closeModal} />
                                            :
                                            <></>
                                    }
                                </div>
                                :
                                <></>


                        }
                        {
                            step === 2 ?
                                <AuditDetails
                                    formik={formik}
                                    audit={audit}
                                    uploads={props.uploads}
                                    step={step}
                                    setStep={setStep}
                                    setCompletedStep={setCompletedStep}
                                    completedStep={completedStep} />

                                :
                                <></>
                        }

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