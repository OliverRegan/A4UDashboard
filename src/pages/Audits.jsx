import React, { useEffect, useState } from 'react';

import '../components/topnav/topnav.css';
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-modal';

import { Button, Link } from "@mui/material";


import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { resetAudit, setAudit } from '../redux/reducers/SaveAudit';

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

import { useMsal } from '@azure/msal-react';
import XeroImport from '../components/AuditsPageComponents/upload/XeroImport';
import AuditDetails from '../components/AuditsPageComponents/auditDetails/AuditDetails';
import FileUploader from '../components/AuditsPageComponents/upload/FileUploader';
import StepIndicator from '../components/Shared/StepIndicator/StepIndicator';
import UploadSelector from '../components/SamplingComponents/UploadSelector/UploadSelector';
import UploadDetails from '../components/AuditsPageComponents/upload/UploadDetails';
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

// const stepList = [
//     {
//         step: 1,
//         name: "Upload Data"
//     },
//     {
//         step: 2,
//         name: "Input Details"
//     },
//     {
//         step: 3,
//         name: "Select Columns"
//     }
// ]

const Audits = (props) => {


    // const [step, setStep] = useState(1)
    // const [completedStep, setCompletedStep] = useState()


    const [modalIsOpen, setIsOpen] = useState(false);
    const [choice, setChoice] = useState();
    const dispatch = useDispatch()
    const audit = useSelector((state) => state.SaveAudit)
    const [file, setFile] = useState(audit.file)
    const [uploadType, setUploadType] = useState("");
    const [dataImported, setDataImported] = useState(false)

    const { instance } = useMsal()
    const profile = instance.getActiveAccount()

    const location = useLocation();

    useEffect(() => {
        let params = new URLSearchParams(location.search);
        if (params.get("xeroAuthRedirect") == "true") {
            setUploadType("xero")
        }

        checkDataImported();

    }, [])

    Modal.setAppElement('body');

    function checkDataImported() {

        let defaultFileData = {
            fileName: "",
            fileSize: ""
        }

        let defaultXeroData = {
            connectionName: "",
            connectionId: "",
            dateStart: "",
            dateEnd: ""
        }
        console.log(audit.importData.file)
        console.log(audit.importData.xero)
        if (JSON.stringify(audit.importData.file) === JSON.stringify(defaultFileData) && JSON.stringify(audit.importData.xero) === JSON.stringify(defaultXeroData)) {
            setDataImported(false)
        } else {
            setDataImported(true)
        }

    }

    const formik = useFormik({
        initialValues: {
            auditName: audit.auditDetails?.auditName != '' ? audit.auditDetails.auditName : '',
            clientName: audit.auditDetails?.clientName != '' ? audit.auditDetails.clientName : '',
            financialYear: audit.auditDetails?.financialYear != '' ? audit.auditDetails.financialYear : '',
        },
        onSubmit: values => {
            // Add data to redux store for current audit
            dispatch(setAudit([audit.importData, audit.accounts, { ...audit.auditDetails, ...values }]))
        },
    });

    function closeModal() {
        setIsOpen(false);
    }

    const openModal = (callback) => {
        setIsOpen(true)
        setChoice(() => callback)
    }


    async function handleImportRemoval() {
        return await checkRemove() ?
            dispatch(resetAudit())
            : ''
    }

    async function checkRemove() {
        return new Promise((resolve, reject) => {
            openModal(userChoice => {
                if (userChoice === true) {
                    setDataImported(() => false)
                    setUploadType("")
                    setIsOpen(false);
                    resolve(true);
                } else {
                    setIsOpen(false);
                    reject(false);
                }
            })
        })
    }


    function dispatchAudit(response, importDetails) {
        let data = response.data

        // props.handleUpload(res);
        let accounts = data.accounts
        accounts.forEach((account) => {
            account['id'] = accounts.indexOf(account)
        })

        let fileData = {
            fileName: "",
            fileSize: ""
        };
        let xeroData = {
            connectionName: "",
            connectionId: "",
            dateStart: "",
            dateEnd: ""
        }

        switch (importDetails.type) {
            case "file":
                fileData.fileName = importDetails.data.fileName
                fileData.fileSize = importDetails.data.fileSize
                break;
            case "xero":
                xeroData.connectionId = importDetails.data.connectionId;
                xeroData.connectionName = importDetails.data.connectionName;
                break;
            default:
                console.error("Something went wrong. Invalid upload type.")
        }
        setDataImported(true)

        dispatch(setAudit([
            {
                file: fileData,
                xero: xeroData
            },
            accounts, {
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
            <div className=" h-screen items-center justify-center bg-grey-lighter w-1/2 mx-auto" >
                {/* <div className="card">
                    <div className="card__body">
                        <StepIndicator 
                        step={step}
                            setStep={setStep}
                            stepList={stepList}
                            setCompletedStep={setCompletedStep}
                            completedStep={completedStep} />
                    </div>
                </div> */}
                {
                    !dataImported ?
                        <div className="card">
                            <div className="card__body">



                                <UploadSelector
                                    setUploadType={setUploadType}
                                    uploadType={uploadType}
                                    setDataImported={setDataImported}
                                />



                            </div>
                        </div>
                        :
                        <></>
                }

                {
                    uploadType != "" && !dataImported ?

                        <>
                            {
                                uploadType === 'file' ?
                                    <div className="card">
                                        <div className="card__body">
                                            <FileUploader
                                                audit={audit}
                                                dispatchAudit={dispatchAudit}
                                                openModal={openModal}
                                                closeModal={closeModal}
                                                handleImportRemoval={handleImportRemoval}
                                                checkRemove={checkRemove}
                                            // setStep={setStep}
                                            />
                                        </div>
                                    </div>
                                    :
                                    <></>
                            }
                            {
                                uploadType === 'xero' ?
                                    <div className="card">
                                        <div className="card__body">
                                            <XeroImport
                                                dispatchAudit={dispatchAudit}
                                            //  setStep={setStep}
                                            />
                                        </div>
                                    </div>
                                    :
                                    <></>
                            }
                        </>

                        :
                        <></>


                }
                {
                    dataImported ?
                        <div className="card">
                            <div className="card__body">
                                <AuditDetails
                                    formik={formik}
                                    audit={audit}
                                    uploads={props.uploads}
                                // step={step}
                                // setStep={setStep}
                                // setCompletedStep={setCompletedStep}
                                // completedStep={completedStep}
                                />
                            </div>
                        </div>
                        :
                        <></>
                }
                {
                    dataImported ?
                        <UploadDetails
                            audit={audit}
                            formatBytes={formatBytes}
                            handleImportRemoval={handleImportRemoval}
                        />
                        :
                        <></>
                }

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