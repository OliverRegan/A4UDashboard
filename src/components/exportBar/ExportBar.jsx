import { Button } from "@mui/material"
import Export from "./JS/Export"

const ExportBar = (props) => {
    return (
        <div className="col-12 px-0">
            <div className="card">
                <div className="card__body">
                    <div className="w-1/2 mx-auto flex justify-around">
                        <Button variant="contained" color="primary" onClick={
                            () => {
                                Export(props.audit, "xlsx")
                            }}>Xlsx Export</Button>
                        <Button variant="contained" color="error" onClick={
                            () => {
                                Export(props.audit, "pdf")
                            }
                        }>PDF Export</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ExportBar