import { useContext } from "react";
import Modal from "./Modal";
import CartContext from "../../store/CartContext";
import { currencyFormatter } from "../../util/formatting";
import Input from "./Input";
import Button from "./Button";
import UserProgressContext from "../../store/UserProgressContext";
import useHttp from "../../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
    method: "POST",
    headers: {
        "content-type": "application/json"
    }
}

const Checkout = () => {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const {data, isLoading: isSending, error, sendRequest, clearData} = useHttp('http://localhost:3000/orders', requestConfig);

    const cartTotal = cartCtx.items.reduce((totalPrice, item)=>
        totalPrice + item.price * item.quantity, 0);

    const handleClose = () =>{
        userProgressCtx.hideCheckout();
    }

    const handleFinish = () => {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    const handleFormSubmit = (event) =>{
        event.preventDefault();

        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        sendRequest(
          JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: customerData
            }
        }));

    }

    let actions = (
        <>
        <Button type="button" textOnly onClick={handleClose}>close</Button>
        <Button>Submit Order</Button>
        </>
    );

    if(isSending){
        actions = <span>Sending order Data...</span>
    }

    if(data && !error){
        return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
            <h2>Success!</h2>
            <p>Your order has been submitted successfully.</p>
            <p>We will get back to you via email within next few minutes.</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal>
    }

    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
        <form onSubmit={handleFormSubmit}>
            <h2>
                Checkout
            </h2>
            <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

            <Input label="Full Name" type="text" id="name"/>
            <Input label="Email Address" type="email" id="email"/>
            <Input label="Street" type="text" id="street"/>
            <div className="control-row">
                <Input label="Postal Code" type="text" id="postal-code"/>
                <Input label="City" type="text" id="city"/>
            </div>

            {error && <Error title="Failed to submit your order" message={error} />}

            <p className="modal-actions">
               {actions}
            </p>
        </form>
    </Modal>

}

export default Checkout;