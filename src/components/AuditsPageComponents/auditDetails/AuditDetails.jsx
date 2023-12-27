import {
    Button,
    TextField,
    Typography,
} from '@mui/material';

const AuditDetails = (props) => {

    return (
        <div>
            <div className='flex flex-col mx-auto'>
                <div classname="flex justify-around my-3">
                    <h1 className='text-center text-2xl'>
                        {props.audit.auditDetails.auditName === '' ? "New Audit" : props.audit.auditDetails.auditName}
                    </h1>
                </div>
                <div className='grid grid-cols-12 justify-around my-3'>
                    <div className='lg:col-span-6 col-span-12 text-center'>
                        <p className="p1 mx-auto text-xl">{props.audit.auditDetails.clientName === '' ? "Enter a client name" : props.audit.auditDetails.clientName}</p>
                    </div>
                    <div className='lg:col-span-6 col-span-12 text-center '>
                        <p className="p1 mx-auto text-xl">{props.audit.auditDetails.financialYear === "" ? "Enter a financial year" : props.audit.auditDetails.financialYear}</p>
                    </div>
                </div>
            </div>
            <form onSubmit={(sub) => {
                props.setStep(() => props.step + 1)
                props.setCompletedStep(() => 1)
                return props.formik.handleSubmit(sub)
            }}>
                <div className='flex flex-col mx-auto  xl:w-1/2 lg:w-3/4' >
                    <TextField
                        label="Audit Name"
                        variant='filled'
                        size='small'
                        placeholder='Audit Name'
                        sx={{
                            my: "4px"
                        }}
                        id="auditName"
                        name="auditName"
                        type="text"
                        onChange={props.formik.handleChange}
                        value={props.formik.values.auditName}
                    />
                    <TextField
                        label="Client Name"
                        variant='filled'
                        size='small'
                        placeholder='Client Name'
                        sx={{
                            my: "4px"
                        }}
                        id="clientName"
                        name="clientName"
                        type="text"
                        onChange={props.formik.handleChange}
                        value={props.formik.values.clientName}
                    />
                    <TextField
                        label="Financial Year"
                        placeholder='Financial Year'
                        variant='filled'
                        size='small'
                        sx={{
                            my: "4px"
                        }}
                        id="financialYear"
                        name="financialYear"
                        type="text"
                        onChange={props.formik.handleChange}
                        value={props.formik.values.financialYear}
                    />
                    <Button
                        type='submit'
                        variant='contained'
                        sx={{
                            mt: '1rem',
                            width: 1 / 2,
                            mx: 'auto'
                        }}>Save</Button>
                </div>
            </form>
        </div>
    )

}

export default AuditDetails