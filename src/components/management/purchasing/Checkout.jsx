
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Auth
import { useMsal } from "@azure/msal-react";

//Custom Hooks and components
import Loader from "../../utility/Loader/Loader";
import useGetToken from "../../utility/Auth/useGetToken";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Checkout = (props) => {

    const [loading, setLoading] = useState(true)
    const [customer, setCustomer] = useState()
    const [subscription, setSubscription] = useState()

    // Stripe elements
    const [options, setOptions] = useState({})
    const [elements, setElements] = useState({})


    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const cart = useLocation().state; // temp
    const navigate = useNavigate()

    // Auth
    const { instance } = useMsal()
    const getToken = useGetToken;

    useEffect(() => {

        // Get customer and check for saved payment details - might move to management dashboard and save to state
        getToken(instance).then(jwt => {
            axios.get(backendUrl + "/stripe/customer", {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            })
                .then(res => {
                    setCustomer(res.data)
                    setLoading(false)
                    return res.data
                }).then((customer) => {
                    // Create subscription and get client secret
                    axios.post(backendUrl + "/stripe/subscriptions/create-subscription", {
                        customer: customer.id,
                        price: cart.price.priceId,
                        quantity: cart.quantity,
                        idemKey: (Math.random() * 1E16).toString() // temp - need to figure out keys down the line
                    }, {
                        headers: {
                            'Authorization': `Bearer ${jwt}`
                        }
                    }).then((res) => {
                        setSubscription(res.data)
                        // Create payment elements with client ID
                        setOptions({
                            clientSecret: res.data.clientSecret,
                            appearance: {}
                        })
                    })
                })
        })


        if (!cart || cart.length == 0) {
            navigate("/management/purchasing")
        }
    }, [navigate])





    return (
        <div className="col-span-12 my-3 bg-gray-100 rounded shadow p-5">
            {
                loading ?
                    <Loader />
                    :
                    <div className="w-5/6 mx-auto">
                        <div className="text-2xl text-gray-500 my-2 mx-2">
                            Cart
                        </div>
                        <hr />
                        <div className="divide-y divide-blue-500 my-5">

                            <div className="grid grid-cols-12 my-2">
                                <div className="col-span-2 h-full flex flex-col justify-center">{cart.product.name}</div>
                                <div className="col-span-1 h-full flex flex-col justify-center">{cart.quantity}</div>
                                <div className="col-span-2 h-full flex flex-col justify-center">$ {(cart.price.amount / 100).toFixed(2).toLocaleString()} per {cart.price.interval}</div>
                                <div className="col-span-6 h-full flex flex-col justify-center">{cart.product.description}</div>
                                <hr className="col-span-12 mt-2" />
                            </div>


                        </div>

                        {/* Payment details here - option for details associated with account */}
                        {
                            !loading && Object.keys(options).length > 0 ?
                                <Elements stripe={stripePromise} options={options}>
                                    <CheckoutForm subscription={subscription} />
                                </Elements>
                                :
                                <Loader />
                        }
                    </div>
            }

        </div>
    )
}

export default Checkout