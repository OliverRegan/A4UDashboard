import React, { useState } from 'react';

import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Customers'
import Audits from '../pages/Audits'
import Accounts from '../pages/Accounts'
import Transactions from '../pages/Transactions'
import Search from '../pages/Search'
import RecurringTransactions from '../pages/RecurringTransactions'

const Routes = (props) => {
    // Receiving audit states
    const [audit, setAudit] = useState();


    const [files, setFiles] = useState()

    const [test, setTest] = useState()
    const [err, setErr] = useState('');

    // Accounts select states
    const [selectedAccounts, setSelectedAccounts] = useState([]);

    // Sampled transactions
    const [sampledTransactions, setSampledTransactions] = useState([]);

    // Samples
    const [samples, setSamples] = useState([0, 0]);

    // Last clicked for accounts
    const [lastClicked, setLastClicked] = useState(null);

    function clear() {

    }

    return (
        <Switch>
            <Route index path='/dashboard' exact component={Dashboard} />
            <Route path='/currentAudits' component={() => <Audits
                setAudit={setAudit}
                files={files}
                setFiles={setFiles}
                clear={clear}
            />} />
            <Route path='/customers' component={Customers} />
            <Route path='/accounts' component={() =>
                <Accounts
                    audit={audit}
                    lastClicked={lastClicked}
                    setLastClicked={setLastClicked}
                    selectedAccounts={selectedAccounts} setSelectedAccounts={setSelectedAccounts}
                />} />
            <Route path='/search' component={() =>
                <Search
                    audit={audit}
                />} />
            <Route path='/recurring-transactions' component={() =>
                <RecurringTransactions
                    audit={audit}
                />} />
            <Route path='/sampling' component={() => <Transactions
                audit={audit}
                selectedAccounts={selectedAccounts}
                sampledTransactions={sampledTransactions}
                setSampledTransactions={setSampledTransactions}
                samples={samples}
                setSamples={setSamples}
                setErr={setErr}
                err={err}
            />} />
        </Switch>
    )
}

export default Routes
