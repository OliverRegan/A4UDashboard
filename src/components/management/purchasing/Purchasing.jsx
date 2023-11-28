import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";


import axios from "axios";

import Product from "./Product/Product";
import Loader from "../../utility/Loader";

import useGetToken from "../../utility/Auth/useGetToken";

const Purchasing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { instance } = useMsal()
    const getToken = useGetToken(instance);

    useEffect(() => {
        getToken.then((jwt) => {
            setLoading(true)
            axios.get(process.env.REACT_APP_BACKEND_URL + "/stripe/products/display", {
                "Authorization": "Bearer " + jwt
            }).then(res => {
                setProducts(res.data)
                setLoading(false)
            })
        })

    }, [])

    return (
        <div className="grid grid-cols-12 gap-3">
            {
                loading ?
                    <div className="col-span-12 align-middle">
                        <Loader />
                    </div>
                    :
                    products.map((product) => {
                        return (
                            <Product product={product} />
                        )
                    })
            }

        </div>
    )
}

export default Purchasing;