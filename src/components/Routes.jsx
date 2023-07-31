import React, { useState } from 'react';

import { Route, Switch } from 'react-router-dom'


import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Customers'
import Audits from '../pages/Audits'
import Accounts from '../pages/Accounts'
import Transactions from '../pages/Transactions'
import Search from '../pages/Search'
import RecurringTransactions from '../pages/RecurringTransactions'
import Home from './home/Home';
import { Redirect } from 'react-router-dom/cjs/react-router-dom';
import ManagementPanel from '../pages/ManagementPanel';



const Routes = (props) => {

    const [err, setErr] = useState('');

    const [files, setFiles] = useState([]);

    return (
        <Switch>

            <Route index path='/dashboard' exact component={Dashboard} />
            <Route path='/currentAudits' component={() => <Audits
                files={files}
                setFiles={setFiles}
            />} />
            <Route path='/customers' component={Customers} />
            <Route path='/accounts' component={() => <Accounts />} />
            <Route path='/search' component={() => <Search />} />
            <Route path='/management' component={() => <ManagementPanel />} />
            <Route path='/recurring-transactions' component={() => <RecurringTransactions />} />
            <Route path='/sampling' component={() => <Transactions
                setErr={setErr}
                err={err}
            />} />
            <Route path="*" component={Home} />
        </Switch>
    )
}

export default Routes
