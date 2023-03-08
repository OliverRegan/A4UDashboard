const TR = (props) => {


    let item = props.item
    let parentProps = props.props
    let index = props.index



    return (
        < tr key={index} className={"cursor-pointer " + (() => {

        })} onClick={(e) => {
            props.handleChange(index, item)
        }}>
            {/* < tr key={index} className={"cursor-pointer"} onClick={event => { handleChange(event.target.parentElement.firstChild, item); }}> */}
            <td>

                {/* {props.selectedAccounts.includes(item) ? <FaCheck className="text-green" /> : <FaTimes className="text-red" />} */}
                <td><strong>
                    {/* {props.selectedAccounts.includes(item) ?
                        <input type="Checkbox" defaultChecked onClick={event => { handleChange(event.target.parentElement.firstChild, item); }} className="mr-2" />
                        :
                        <input type="Checkbox" onClick={event => { handleChange(event.target.parentElement.firstChild, item); }} className="mr-2" />
                    } */}
                    Select Account</strong></td>
                {/* <i value={true} className={"cursor-pointer bx bxs-check-square text-green"} onClick={event => { event.stopPropagation(); event.target.parentElement.parentElement.click() }}></i> : <i value={false} className={"cursor-pointer bx bxs-x-square text-red"} onClick={event => { event.stopPropagation(); event.target.parentElement.parentElement.click() }}></i> */}
            </td>
            <td>{item.transactions == null ? 'Account Name' : item.name}</td>
            <td>{item.totalCredit == null ? 'Transactions - credit' : ("$" + parseFloat(item.totalCredit).toLocaleString())}</td>
            <td>{item.totalDebit == null ? 'Transactions - debit' : ("$" + parseFloat(item.totalDebit).toLocaleString())}</td>
            {/* <td>{item.debitNum == null ? 'Transactions - debit' : item.}</td> */}
            <td>{item.transactions == null ? 'Total Debit' : "$" + (Math.abs((parseFloat(item.totalDebit) - parseFloat(item.totalCredit))).toLocaleString())}<span>{(parseFloat(item.totalDebit) - parseFloat(item.totalCredit)) < 0 ? " CR" : " DR"}</span></td>
        </tr >
    )
}

export default TR