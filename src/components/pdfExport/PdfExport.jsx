const PdfExport = () => {
    const printHandler = () => {

        const printElement = ReactDOMServer.renderToString(PDFJSX());

        html2pdf().from(printElement).save();

    }
    // Export stuff
    const PDFJSX = () => {
        const date = new Date();
        const currentDateTime = date.getHours() + ":" + date.getMinutes() + " "
            + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        return (
            <div className='m-4 p-4'>
                <div className='my-3 flex justify-around'>
                    <div>
                        Date: {currentDateTime}
                    </div>
                    <div>
                        Auditor: {"Example user"}
                    </div>
                </div>
                <div className='my-3 flex justify-around'>
                    <div>
                        No. of samples: {props.sampledTransactions.length}
                    </div>
                    <div>
                        Seed Code: {seedCode}
                    </div>
                </div>
                <Table
                    headData={customerTableHead}
                    renderHead={(item, index) => renderHead(item, index)}
                    bodyData={props.sampledTransactions.length != [] ? props.sampledTransactions : customerList}
                    renderBody={(item, index) => renderBody(item, index, props)}

                />
            </div>
        )
    }
}
export default PdfExport

