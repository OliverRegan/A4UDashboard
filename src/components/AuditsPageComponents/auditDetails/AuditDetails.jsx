import {
    Button,
    TextField,
    Typography,
} from '@mui/material';

import { positions } from '@mui/system'

const AuditDetails = (props) => {


    return (
        <div>
            <form onSubmit={(sub) => {
                props.setStep(() => props.step + 1)
                props.setCompletedStep(() => 1)
                return props.formik.handleSubmit(sub)
            }}>
                <div className='flex flex-col' >
                    <TextField
                        label="Audit Name"
                        variant='standard'
                        placeholder='Audit Name'
                        sx={{
                            my: "4px",

                        }}
                        id="auditName"
                        name="auditName"
                        type="text"
                        onChange={(e) => {
                            props.formik.handleChange(e)
                            return props.formik.handleSubmit()
                        }}
                        value={props.formik.values.auditName}
                    />
                    <TextField
                        label="Client Name"
                        variant='standard'
                        placeholder='Client Name'
                        sx={{
                            my: "4px"
                        }}
                        id="clientName"
                        name="clientName"
                        type="text"
                        onChange={(e) => {
                            props.formik.handleChange(e)
                            return props.formik.handleSubmit()
                        }} value={props.formik.values.clientName}
                    />
                    <TextField
                        label="Financial Year"
                        placeholder='Financial Year'
                        variant='standard'
                        sx={{
                            my: "4px"
                        }}
                        id="financialYear"
                        name="financialYear"
                        type="text"
                        onChange={(e) => {
                            props.formik.handleChange(e)
                            return props.formik.handleSubmit()
                        }} value={props.formik.values.financialYear}
                    />
                </div>
            </form>
        </div>
    )

}

export default AuditDetails