import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"

const CheckoutForm = (props) => {

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!stripe || !elements) { // No stripe or elements yet
            return;
        }

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/management/subscriptions"
            },
            
        });

        if (result.error) {
            //Show error
            console.log(result.error)
        } else {
        }

    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button>Submit</button>
        </form>
    )
}

export default CheckoutForm