import { InteractionStatus } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useEffect } from "react";
import Loader from "../components/utility/Loader/Loader";

const Authenticating = () => {
    const { instance, inProgress } = useMsal();

    const isAuthenticated = useIsAuthenticated();
    return (
        <>
            {inProgress && !isAuthenticated || !(!isAuthenticated && inProgress == InteractionStatus.None)
                ?
                <div className="w-full text-center h-screen flex flex-column justify-center items-center">
                    <div className="align-middle">
                        <h3>Please wait, we're signing you in...</h3>
                        <Loader />
                    </div>
                </div>
                :
                <div className="w-full text-center h-screen flex flex-column justify-center items-center">
                    <div className="align-middle">
                        <h3>Something went wrong, please contact the team.</h3>
                    </div>
                </div>}
        </>

    )
}
export default Authenticating