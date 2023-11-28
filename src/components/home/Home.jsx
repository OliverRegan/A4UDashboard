import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
// import { Redirect } from "react-router-dom"
const Home = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/currentAudits")
    }, [navigate])
    return (
        <>
        </>
    )
}
export default Home