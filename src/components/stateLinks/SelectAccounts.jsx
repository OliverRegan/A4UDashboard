import { Link } from "react-router-dom/cjs/react-router-dom"

const SelectAccounts = (props) => {

    return (
        <>
            {
                props.audit ?
                    <Link to="/accounts">Select Accounts</Link>
                    :
                    <></>
            }
        </>
    )
}
export default SelectAccounts