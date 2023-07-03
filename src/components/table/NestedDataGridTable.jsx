import { DataGridPro, DataGridProProps, GridColDef } from '@mui/x-data-grid-pro';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';



// IMPORTANT!!!!
// This component can only take List<List<Transaction>> datatypes

function createRowsAndColumns(data) {
    let rows = []
    let columns = []

    data.forEach((data) => {
        rows.push(data[0])
    })
    Object.keys(data[0][0]).forEach((key) => {
        let newCol = {}
        newCol['field'] = data[0][0][key]
        newCol['headerName'] = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()
        columns.push(newCol)
    })
    console.log(columns)

}


const NestedDataGridTable = (props) => {

    const [rows, setRows] = useState([])
    const [cols, setCols] = useState([])

    useEffect(() => {
        createRowsAndColumns(props.data, setRows, setCols)
    })

    console.log(props.data)
    return (
        <Box sx={{ width: '100%', height: 400 }}>

            <DataGridPro
                columns={cols}
                rows={rows}
                rowThreshold={0}
            // getDetailPanelHeight={getDetailPanelHeight}
            // getDetailPanelContent={getDetailPanelContent}
            />
        </Box>

    )
}

export default NestedDataGridTable