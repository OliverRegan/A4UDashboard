import { Button, Box } from "@mui/material"
import Export from "./JS/Export"
import React, { useEffect, useState } from 'react'
import useGetToken from '../../utility/Auth/useGetToken';
import { useMsal } from "@azure/msal-react";
import Modal from '@mui/material/Modal';


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

    const { instance } = useMsal()
    const getToken = useGetToken(instance);

    function doExport(type) {
        // Check sampling has been done first
        if (props.audit.auditDetails.sampling.sampledTransactions.length > 0 && (props.audit.auditDetails.sampling.creditSampled > 0 || props.audit.auditDetails.sampling.debitSampled > 0)) {
            if (type === "excel") {
                Export(props.audit, "xlsx", getToken)
            } else {
                Export(props.audit, "pdf", getToken)
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
    return (
        <div className="col-12 px-0">
            <div className="card">
                <div className="card__body">
                    <div className="w-1/2 mx-auto flex justify-around">
                        <Button variant="contained" color="primary" onClick={
                            () => {
                                doExport('excel')
                            }}>Xlsx Export</Button>
                        <Button variant="contained" color="error" onClick={
                            () => {
                                doExport('pdf')
                            }
                        }>PDF Export</Button>
                    </div>
                </div>
            </div>
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