import Modal from '@mui/material/Modal';
import { Box } from "@mui/material"
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    height: '70%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};
function createRowsAndColumns(data, setRows, setCols) {
    let rows = []
    let columns = []
    data.forEach((element) => {
        element['id'] = data.indexOf(element)
        rows.push(element)

    })
    Object.keys(data[0]).forEach((key) => {
        let newCol = {}
        newCol['field'] = key
        newCol['headerName'] = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()
        newCol['width'] = 200
        // newCol['headerName'] = key
        columns.push(newCol)
    })
    console.log(columns)
    console.log(rows)
    setCols(columns)
    setRows(rows)

}

const TransactionModal = (props) => {

    const [rows, setRows] = useState([])
    const [cols, setCols] = useState([])

    useEffect(() => {
        if (props.dataObj) {
            createRowsAndColumns(props.dataObj, setRows, setCols)
        }

    }, [props.dataObj])

    const handleClose = () => {
        props.setShowModal(false)
        props.setDataObj()
    }
    console.log(props)
    return (<>
        {!props.dataObj ? <></>
            :
            <Modal
                open={props.showModal}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style }}>
                    <DataGrid
                        rows={rows}
                        columns={cols}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Modal>
        }</>)
}

export default TransactionModal