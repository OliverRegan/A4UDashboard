import { Button } from "@mui/material"
import { useContext } from "react"
import { ResultContext } from "../utility/Auth/ResultContext"
import Export from "./JS/Export"

const ExportBar = (props) => {

    // Get auth result from context
    const [result, error] = useContext(ResultContext)


    return (
        <div className="col-12 px-0">
            <div className="card">
                <div className="card__body">
                    <div className="w-1/2 mx-auto flex justify-around">
                        <Button variant="contained" color="primary" onClick={
                            () => {
                                Export(props.audit, "xlsx", result.accessToken)
                            }}>Xlsx Export</Button>
                        <Button variant="contained" color="error" onClick={
                            () => {
                                Export(props.audit, "pdf", result.accessToken)
                            }
                        }>PDF Export</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ExportBar