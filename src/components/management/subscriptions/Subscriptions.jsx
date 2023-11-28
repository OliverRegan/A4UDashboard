// React
import { useEffect, useState } from "react";
import axios from "axios";

// Auth
import { useMsal } from "@azure/msal-react";

//Custom Hooks and components
import Loader from "../../utility/Loader";
import useGetToken from "../../utility/Auth/useGetToken";

const Subscriptions = () => {

    const { instance } = useMsal()
    const getToken = useGetToken

    const [error, setError] = useState({ error: false, message: "" });
    const [loading, setLoading] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);



    useEffect(() => {

        getToken(instance).then((jwt) => {
            setLoading(true)
            axios.get(process.env.REACT_APP_BACKEND_URL + "/stripe/subscriptions", {
                headers: {
                    "Authorization": "Bearer " + jwt

                },
                params: {
                    type: ""
                }
            }).then(res => {
                console.log(res.data)
                setSubscriptions(res.data)
                setLoading(false)
                setError({ error: false, message: "" })
            }).catch(e => {
                console.log(e)
                setLoading(false)
                setError({ error: true, message: e.message })
            })
        })

    }, [])


    return (
        <>Subscriptions</>
    )
}

export default Subscriptions;