
import placeholder from "../../../../assets/images/profile.png"
import { Link } from "react-router-dom";


const Product = (props) => {

    return (
        <Link to={"product/" + props.product.productId} className="rounded bg-gray-100 shadow col-span-3 p-3 hover:scale-[1.05] transition-all duration-100 cursor-pointer">
            <div className="mx-auto w-3/4 text-center">
                <img src={props.product.images[0] ?? placeholder} className="max-w-full rounded" />
            </div>
            <div className="w-full text-center my-4">
                <h2>
                    {props.product.name}
                </h2>
            </div>
        </Link>
    )
}

export default Product