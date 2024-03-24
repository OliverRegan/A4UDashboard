import { useEffect } from "react";
import "./Loader.css"




const Loader = () => {

    useEffect(() => {
        // put a timer here for requests that take too long??
    }, [])

    return (
        <div className="loadingIcon"></div>
    )
}
export default Loader;