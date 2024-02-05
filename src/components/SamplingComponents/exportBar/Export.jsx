import Export from "./JS/Export"
import React, { useEffect, useState } from 'react'
import useGetToken from '../../utility/Auth/useGetToken';
import { useMsal } from "@azure/msal-react";
import Modal from '@mui/material/Modal';
import {
    Drawer,
    Button,
    Box
} from '@mui/material';
import { useSelector } from "react-redux";
import SaveAudit from "../../../redux/reducers/SaveAudit";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    minHeight: '20%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};
const ExportBar = (props) => {

    const [showModal, setShowModal] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const audit = useSelector((state) => state.SaveAudit)

    const { instance } = useMsal()
    const getToken = useGetToken;

    function doExport(type) {
        // Check sampling has been done first
        if (props.audit.auditDetails.sampling.sampledTransactions.length > 0 && (props.audit.auditDetails.sampling.creditSampled > 0 || props.audit.auditDetails.sampling.debitSampled > 0)) {
            if (type === "excel") {
                Export(props.audit, "xlsx", getToken, instance)
            } else {
                Export(props.audit, "pdf", getToken, instance)
            }
        }
        else {
            console.log("error")
            setShowModal(true)
        }
    }

    const handleClose = () => {
        setShowModal(false)
    }

    const toggleDrawer = (open) =>
        (event) => {
            if (
                event.type === 'keydown' &&
                ((event).key === 'Tab' ||
                    (event).key === 'Shift')
            ) {
                return;
            }
            setShowDrawer(open)
        };
    return (
        <div className="flex flex-col justify-end">
            <div className="m-2">
                <Button
                    disabled={audit.auditDetails.sampling.sampledTransactions.length <= 0}
                    onClick={toggleDrawer(true)}
                    variant="contained"
                >Export</Button>
            </div>
            <Drawer
                anchor={'bottom'}
                open={showDrawer}
                onClose={toggleDrawer(false)}
            >

                <div className="px-0 py-5 min-h-40 w-1/2">
                    <div className={"  row min-h-10 my-5"}
                        onClick={() => {
                            doExport('excel')
                        }}
                    >
                        <div className="col-2  flex flex-col justify-center">
                            <div className="flex justify-center">

                            </div>
                        </div>
                        <div className="col-10 hover:bg-blue-400  hover:text-white hover:cursor-pointer rounded-md flex flex-col justify-center">
                            <h2 className="text-lg -2">
                                Excel Export (.xlsx)
                            </h2>

                        </div>
                    </div>
                    <div className={"  row min-h-10 my-5"}
                        onClick={() => {
                            doExport('pdf')
                        }}
                    >
                        <div className="col-2  flex flex-col justify-center">
                            <div className="flex justify-center">

                            </div>
                        </div>
                        <div className="col-10 hover:bg-blue-400  hover:text-white hover:cursor-pointer rounded-md flex flex-col justify-center">
                            <h2 className="text-lg -2">
                                PDF Export (.pdf)
                            </h2>

                        </div>
                    </div>

                    {/* <div className="w-1/2 mx-auto flex justify-around">
                        <Button variant="contained" color="primary" onClick={
                            () => {
                                doExport('excel')
                            }}>Xlsx Export</Button>
                        <Button variant="contained" color="error" onClick={
                            () => {
                                doExport('pdf')
                            }
                        }>PDF Export</Button>
                    </div> */}


                </div>
            </Drawer>
            <Modal
                open={showModal}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                {/* Add an actual error here pls */}
                <Box sx={{ ...style }}>
                    <div className="w-3/4 mx-auto">
                        <p className="text-center my-10 text-xl font-semibold">
                            You need to sample transactions before exporting. An export of all transactions without sampling data is not yet available.
                        </p>
                        <div className="w-2/4 mx-auto">
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => { setShowModal(false) }}>Okay</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>

    )
}
export default ExportBar