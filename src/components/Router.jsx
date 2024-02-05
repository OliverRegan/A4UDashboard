import React, { useState } from 'react';

import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Customers'
import Audits from '../pages/Audits'
import Accounts from '../pages/Accounts'
import Sampling from '../pages/Sampling'
import Search from '../pages/Search'
import SamplingDetails from '../pages/SamplingDetails'

import RecurringTransactions from '../pages/RecurringTransactions'
import Home from './home/Home';
import ManagementPanel from '../pages/ManagementPanel';
import Purchasing from "./management/purchasing/Purchasing"
import CustomerDetails from "./management/customer_details/CustomerDetails"
import Invoices from "./management/invoices/Invoices"
import Layout from './layout/Layout';
import ManagementDashboard from './management/managementDashboard/ManagementDashboard';
import ProductPage from './management/purchasing/Product/ProductPage';
import Checkout from './management/purchasing/Checkout';
import Subscriptions from './management/subscriptions/Subscriptions';


const Router = (props) => {

    const [err, setErr] = useState('');

    const [uploads, setUploads] = useState([]);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/dashboard" element={<Layout />}>
                        <Route index element={<Audits
                            uploads={uploads}
                            setUploads={setUploads}
                        />} />
                        <Route path='customers' element={<Customers />} />
                        <Route path='accounts' element={<Accounts />} />
                        <Route path='search' element={<Search />} />
                        <Route path='management' element={<ManagementPanel />} >
                            <Route path="*" index element={<ManagementDashboard />} />
                            <Route path="subscriptions" element={<Subscriptions />} />
                            <Route path="customer_details" element={<CustomerDetails />} />
                            <Route path="invoices" element={<Invoices />} />
                            <Route path="purchasing" element={<Purchasing />} />
                            <Route path='purchasing/product/:id' element={<ProductPage />} />
                            <Route path='purchasing/checkout' element={<Checkout />} />
                        </Route>
                        <Route path='recurring-transactions' element={<RecurringTransactions />} />
                        <Route path='sampling' element={<Sampling
                            setErr={setErr}
                            err={err}
                        />} />
                        <Route path='sampling-details' element={<SamplingDetails />} />
                        <Route path="*" element={<Home />} /> {/* Basically a catch-all to redirect to currentAudits*/}

                    </Route>
                    <Route path="*" element={<Home />} />
                </Routes >
            </BrowserRouter>
        </>
    )
}

export default Router
