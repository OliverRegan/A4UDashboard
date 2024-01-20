// React imports
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Auth
import { useMsal } from "@azure/msal-react";

// Hooks & static
import useGetToken from "../../../utility/Auth/useGetToken"
import { useParams } from "react-router-dom";
import Loader from "../../../utility/Loader/Loader";
import placeholder from "../../../../assets/images/profile.png"


const ProductPage = () => {

    const [productObj, setProductObj] = useState();
    const [quantity, setQuantity] = useState(1);
    const [priceDetails, setPriceDetails] = useState({});
    const [loading, setLoading] = useState(true);
    // Product Id
    const { id } = useParams();

    // Auth
    const { instance } = useMsal()
    const getToken = useGetToken;


    useEffect(() => {

        getToken(instance).then((jwt) => {
            axios.get(process.env.REACT_APP_BACKEND_URL + "/stripe/products/page/" + id, {
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                    "Content-Type": "application/json"
                }
            }).then((res) => {
                setProductObj(res.data)
                console.log(res)
                setLoading(false)
            })
        })
    }, [])

    function CreateSubscriptionAndGetIntent(product) {
        const body = {
            test: "hello"
        }
        getToken.then((jwt) => {
            axios.post(process.env.REACT_APP_BACKEND_URL + "/stripe/checkout/create-checkout-session", body, {
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                    "Content-Type": "application/json"
                }
            }).then((res) => { window.location = res.data })
        })
    }


    return (
        <div>
            {
                loading ?
                    <Loader />
                    :
                    <div className="col-span-12 my-3 bg-gray-100 rounded shadow p-5">
                        <div className="w-full flex justify-center">
                            <img src={productObj.images[0] ?? placeholder} className="rounded" />
                        </div>
                        <div className="mx-auto w-3/4 mt-5 mb-2">
                            <div className="text-gray-500 text-2xl text-center">
                                {productObj.name}
                            </div>
                            <hr />
                            <div className="text-center my-3">
                                {productObj.description}
                            </div>
                        </div>
                        {/* Price selection */}
                        <div className="flex justify-around gap-4 w-5/6 mx-auto mt-5">
                            {productObj.prices.map((price) => {
                                return (
                                    <div className={"rounded shadow w-1/2 hover:scale-[1.02] cursor-pointer p-3 transition-all duration-100 " + (priceDetails.priceId == price.priceId ? "bg-blue-500 text-gray-50 hover:bg-blue-400 hover:text-gray-100" : "bg-gray-50 text-gray-500")} onClick={() => { setPriceDetails(price) }}>
                                        <div>
                                            {price.nickname ?? "No plan name"}
                                        </div>
                                        <div>
                                            {price.priceType[0].toUpperCase() + price.priceType.slice(1)}
                                        </div>
                                        <div>
                                            $ {(price.amount / 100).toFixed(2).toLocaleString()}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="my-5 w-1/2 mx-auto text-center">
                            ADD AMOUNT SELECTOR HERE
                        </div>

                        <div className="my-5 w-1/2 mx-auto flex justify-around">
                            {/* State usage is tamporary - will change to cart */}
                            <Link
                                to={"/management/purchasing/checkout"}
                                state={{ price: priceDetails, quantity: quantity, product: productObj }}
                                className="bg-blue-500 px-5 py-2 rounded text-gray-100 hover:text-gray-50 hover:bg-blue-400 transition-all duration-100">Checkout</Link>
                        </div>
                    </div>
            }
        </div>
    )
}

export default ProductPage