import { useEffect } from "react";

const SampledTransactionDetail = ({ transaction }) => {

    useEffect(() => {
        console.log(transaction)
    })

    return (
        <div className="mt-3 w-full">
            <div className="">
                <h2>
                    {transaction.externalId}
                </h2>
                <div className="h-[2px] bg-gray-500"></div>
            </div>
            <div className="p-3 grid grid-cols-12 w-full">
                <div className="grid grid-cols-12 col-span-12 w-full">
                    <div className="col-span-6">
                        <div className="flex justify-between">
                            <p>
                                Invoice issued:
                            </p>
                            <div className="w-[60%]">
                                <p>
                                    {transaction.details.issueDate}
                                </p>
                            </div>

                        </div>
                        <div className="flex justify-between">
                            <p>
                                Invoice Due:
                            </p>
                            <div className="w-[60%]">
                                <p>
                                    {transaction.details.dueDate}
                                </p>
                            </div>

                        </div>
                        <div className="flex justify-between">
                            <p>
                                Invoice Paid:
                            </p>
                            <div className="w-[60%]">
                                <p>
                                    {transaction.details.fullyPaidOnDate}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <p>
                                Currency Code:
                            </p>
                            <div className="w-[60%]">
                                <p>
                                    {transaction.details.currencyCode}
                                </p>
                            </div>

                        </div>
                    </div>
                    <div className="col-span-6">
                        <div className="flex justify-between">
                            <p>
                                Item Debit Amount:
                            </p>
                            <div className="w-[40%]">
                                <p>
                                    $ {Number.parseFloat(transaction.debit).toFixed(2)}
                                </p>
                            </div>

                        </div>
                        <div className="flex justify-between">
                            <p>
                                Item Credit Amount:
                            </p>
                            <div className="w-[40%]">
                                <p>
                                    $ {Number.parseFloat(transaction.credit).toFixed(2)}
                                </p>
                            </div>

                        </div>
                        <div className="flex justify-between">
                            <p>
                                Invoice Sub-Total:
                            </p>
                            <div className="w-[40%]">
                                <p>
                                    $ {transaction.details.subTotal.toFixed(2)}
                                </p>
                            </div>

                        </div>
                        <div className="flex justify-between">
                            <p>
                                Invoice Tax:
                            </p>
                            <div className="w-[40%]">
                                <p>
                                    $ {transaction.details.totalTax.toFixed(2)}
                                </p>
                            </div>

                        </div>
                        <div className="flex justify-between">
                            <p>
                                Invoice Total:
                            </p>
                            <div className="w-[40%]">
                                <p>
                                    $ {transaction.details.total.toFixed(2)}
                                </p>
                            </div>

                        </div>
                    </div>
                    <div className="col-span-12 mt-5">
                        {/* // Needs to be changed to be the line item description that matches within the details of the transaction  */}
                        {transaction.description}
                    </div>
                    {
                        transaction.details.payments.length > 0 ?
                            <div className="col-span-12">
                                <h4>
                                    Payments
                                </h4>
                                <div className="h-[2px] bg-gray-500"></div>
                            </div>
                            :
                            <></>
                    }
                    {
                        transaction.details.credits.length > 0 ?
                            <div className="col-span-12 mt-5">
                                <h4>
                                    Credits
                                </h4>
                                <div className="h-[2px] bg-gray-500"></div>
                                <div>
                                    {
                                        transaction.details.credits.map(creditObj =>
                                            <div>
                                                <div className="flex">
                                                    <div className="w-[40%] flex">
                                                        <p>
                                                            Credit Note Number:
                                                        </p>
                                                        <p>
                                                            {creditObj.creditNoteNumber}
                                                        </p>
                                                    </div>
                                                    <div className="w-[40%] flex">
                                                        <p>
                                                            Credit Note Id:
                                                        </p>
                                                        <p>
                                                            {creditObj.creditId}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            :
                            <></>
                    }

                </div>


            </div>

        </div>
    )

}
export default SampledTransactionDetail;