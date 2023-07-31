import { Button } from "@mui/material"
import ExportPDF from "./JS/ExportPDF"

const ExportBar = (props) => {
    return (
        <div className="col-12">
            <div className="card">
                <div className="card__body">
                    <Button variant="contained" color="primary">Export As Excel</Button>
                    <Button variant="contained" color="success">Export As CSV</Button>
                    <Button variant="contained" color="error" onClick={
                        () => {
                            ExportPDF(props.audit)
                        }
                    }>Export As PDF</Button>
                </div>
            </div>
        </div>
    )
}
export default ExportBar