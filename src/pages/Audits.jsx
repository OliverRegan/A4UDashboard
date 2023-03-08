import React, { useState, useEffect, useDispatch, useRef } from 'react';
import '../components/topnav/topnav.css';
import Dropdown from '../components/dropdown/Dropdown';
import ThemeMenu from '../components/thememenu/ThemeMenu';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Axios from 'axios';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose as closeIcon } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '20%',
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
    const [startDate, setStartDate] = useState(new Date());
    const [message, setMessage] = useState(['', false]);
    const [allowSubmit, setAllowSubmit] = useState();
    const submitBtn = useRef();
    const fileInput = useRef();

    let file = false;

    // Tests to see if sheet is already uploaded
    useEffect(() => {

    }, [])


    Modal.setAppElement('body');

    const history = useHistory();

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    // File handler
    function fileHandler(event) {
        props.setFile(null)
        props.setAudit(null)
        props.setFileUploaded(false)
        props.setSampledTransactions([])
        props.setSamples([0, 0])
        props.setSelectedAccounts([])
        props.setFileName(event.target.files[0].name);
        props.setAudit(event.target.files[0]);
        setAllowSubmit(() => true);
        if (props.fileUploaded) {
            props.setFileUploaded(false);
        }
    }

    function testSubmit() {
        // console.log(fileUploaded)
        if (!props.fileUploaded) {
            setIsOpen(true);
        }

        submit()
        // .then(fileUploaded = submitResponse.status)
        // .then(setError(() => submitResponse.message))
        // .then(console.log(submitResponse))
    }

    // Pass file to API and get response
    function submit() {
        if (props.fileUploaded) {
            return;
        }
        // Clear selected accounts
        // Upload endpoint url
        const auditUploadUrl = process.env.REACT_APP_BACKEND_URL + "/audit/excel"
        // Assign form data - attach uploaded file
        let formData = new FormData();
        let file = props.audit.name;
        formData.append('file', props.audit);
        formData.append('filename', file)
        const config = {
            'Content-Type': 'multipart/form-data; boundary=-------arbritrary;"'
        };


        // Send file to back end and receive response
        Axios.post(auditUploadUrl, formData)
            .then((response) => {
                props.setAudit(response.data);
                props.setFileUploaded(true);
                setIsOpen(false)

            }
            )
            .catch((err) => {
                setIsOpen(false);
                console.log(err, formData)
                setMessage([err.message, true])
            })

    }

    function clear() {
        props.setFileName('');
        props.setAudit(null);
        props.setFileUploaded(false);
        props.setFile()
        props.setAudit()
        props.setFileUploaded(false)
        props.setSampledTransactions([])
        props.setSamples([0, 0])
        props.setSelectedAccounts([])
        setIsOpen(false);
        setMessage(['', false]);
        setAllowSubmit(false);
    }

    return (
        <div id='main'>

            <div class="grid w-full h-screen items-center justify-center bg-grey-lighter grid" className='form14'>
                <h1>New Audit</h1><br /><br />
                <p className="p1">Client Name</p><br />
                <div className="topnav__search">
                    <input type="text" placeholder='' />
                    <i className='bx bx-search'></i>
                </div><br />
                <p className="p1">Financial Year</p><br />
                {/* <DatePicker className="date14" selected={startDate} onChange={(date: Date) => setStartDate(date)} /> */}

                <div>
                    <div className="flex flex-col w-full h-screen items-center justify-center bg-667080">
                        {message[1] ?
                            <div className="text-red my-3">Something went wrong: {message[0]}</div> :
                            ""
                        }

                        <form onSubmit={submit} className="">
                            <label className={" flex flex-col items-center px-4 py-6 bg-white text-#667080 rounded-lg shadow-lg tracking-wide uppercase border border-grey cursor-pointer hover:border-blue hover:bg-white hover:text-black " + (props.fileUploaded ? "bg-green hover:bg-green text-black border-green" : "") + (message[1] ? "bg-red hover:bg-red text-black border-red" : "")}>
                                <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                </svg>
                                <span className="mt-2 text-base leading-normal">{props.fileName != '' ? props.fileName : 'Select a file'}</span>
                                <input type='file' className="hidden" name="file" onChange={fileHandler} ref={fileInput} />
                            </label>
                        </form>
                        {
                            (props.fileName != "" && !props.fileUploaded) ?
                                <button className={('bg-blue hover:bg-green py-4 w-3/4 mt-5 rounded-lg text-white')} type='button' onClick={file ? '' : testSubmit}
                                >
                                    <p className=''>
                                        Submit
                                    </p>
                                </button>
                                :
                                ""
                        }

                        {
                            props.fileUploaded ?

                                <button className='btn-blue py-4 mt-5 rounded-lg w-3/4' type='button' onClick={(e) => {
                                    history.push("/accounts")
                                }}>
                                    <p className=''>
                                        Select Accounts
                                    </p>
                                </button>

                                :
                                ""
                        }
                        {
                            props.fileUploaded ?

                                <button className='btn-grey py-4 mt-5 rounded-lg w-3/4' type='button' onClick={file ? '' : clear}>
                                    <p className=''>
                                        Clear Audits
                                    </p>
                                </button>

                                :
                                ""
                        }

                    </div>


                </div>
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
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Loading..."
                shouldCloseOnOverlayClick={false}
            >
                <div className='px-4 h-full flex flex-col justify-center'>
                    <h2 className='text-center my-5'>Loading...</h2>
                    <div className='text-center'>Please wait while we load your accounts.</div>
                </div>
            </Modal>
        </div>

    )
}

export default Audits