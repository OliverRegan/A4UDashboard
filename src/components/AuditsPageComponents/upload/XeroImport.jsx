import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useDispatch, useSelector } from "react-redux";
import { setAudit } from "../../../redux/reducers/SaveAudit";
import axios from "axios";

import XeroAuth from "../../Xero/XeroAuth/XeroAuth"
import useGetToken from '../../utility/Auth/useGetToken';
import { GetCookie } from "../../utility/Cookies/SetGetCookie";
import XeroOrganizations from "../../Xero/XeroOrganizations/XeroOrganizations";
import { useHistory } from "react-router-dom";
import Loader from "../../utility/Loader/Loader";


const XeroImport = (props) => {

    const [authorised, setAuthorised] = useState(false);
    const dispatch = useDispatch()
    const audit = useSelector((state) => state.SaveAudit)
    const [connections, setConnections] = useState([]);
    const [selectedConnection, setSelectedConnection] = useState();
    const location = useLocation();



    // auth
    const { instance } = useMsal();
    const getToken = useGetToken(instance);

    // import URL
    let xeroUrl = process.env.REACT_APP_BACKEND_URL + "/external-integration/xero"

    useEffect(() => {
        if (selectedConnection) {
            console.log(selectedConnection)
            getXeroData(selectedConnection)
        } else {
            let params = new URLSearchParams(location.search);
            if (params.get("xeroAuthRedirect") == "true" && authorised) {
                // Get and display connection options
                getXeroConnections();

            }
        }

    }, [authorised, selectedConnection])

    function getXeroConnections() {

        let token = JSON.parse(GetCookie("XeroAuth"))
        let body = {
            "token": token.access_token
        }
        console.log(token.access_token)

        getToken.then((jwt) => {
            axios.post((xeroUrl + "/connections"), body, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': "application/json"
                }
            }).then((res) => {

                setConnections(() => res.data)

            }).catch((err) => {
                console.log(err)
                // setAuthorised(() => false)// temp
            })
        })
    }
    function getXeroData(connection) {

        let token = JSON.parse(GetCookie("XeroAuth"))

        let body = {
            "token": token.access_token,
            "connection": connection
        }
        // dispatch(setAudit([
        //     {
        //         file: {
        //             fileName: "",
        //             fileSize: ""
        //         },
        //         xero: {
        //             connectionName: connection.name,
        //             connectionId: connection.id,
        //             dateStart: "",
        //             dateEnd: ""
        //         }
        //     },
        //     audit.accounts,
        //     audit.auditDetails
        // ]))
        // use connection to go and get general ledger reconstruction from back end
        getToken.then((jwt) => {
            axios.post((xeroUrl + "/general-ledger"), body, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            }).then((res) => {
                console.log(res)

                // Set audit here
                props.dispatchAudit(res, {
                    type: 'xero',
                    data: {
                        connectionId: connection.id,
                        connectionName: connection.name
                    }
                });
                // props.setStep(2);
            }).catch((err) => {
                console.log(err)
            })
        })

    }
    return (
        <>
            {
                authorised ?
                    <div className="flex justify-center">
                        {
                            connections.length === 0 ?
                                <Loader />

                                :
                                selectedConnection ?
                                    <div>
                                        <div className="my-4">
                                            Getting General Ledger
                                        </div>
                                        <Loader />
                                    </div>
                                    :
                                    <XeroOrganizations connections={connections} selectedConnection={selectedConnection} setSelectedConnection={setSelectedConnection} />
                        }

                    </div>
                    :
                    <XeroAuth setAuthorised={setAuthorised} redirectPath={"/currentAudits"} />
            }
        </>
    )
}
export default XeroImport