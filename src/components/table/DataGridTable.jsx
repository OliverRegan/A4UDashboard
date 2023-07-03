import { useState, useEffect } from "react"
import { DataGrid } from '@mui/x-data-grid';
import { Box } from "@mui/material";

function createRowsAndColumns(data, setRows, setCols) {
    let rows = []
    let columns = []

    data.forEach((element) => {
        rows.push(element)
    })
    Object.keys(data[0]).forEach((key) => {
        let newCol = {}
        newCol['field'] = data[0][key]
        // newCol['headerName'] = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()
        newCol['headerName'] = key
        columns.push(newCol)
    })
    console.log(columns)
    console.log(rows)
    setCols(columns)
    setRows(rows)

}

const DataGridTable = (props) => {

    const [rows, setRows] = useState([])
    const [cols, setCols] = useState([])

    useEffect(() => {
        createRowsAndColumns(props.data, setRows, setCols)
    })

    return (
        <Box sx={{ height: 400, width: '100%' }}>
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
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    )
}

export default DataGridTable