import { useContext } from "react";
import Modal from "./Modal";
import CartContext from "../../store/CartContext.jsx";
import { currencyFormatter } from "../../util/formatting";
import Button from "./Button";
import UserProgressContext from "../../store/UserProgressContext.jsx";
import CartItem from "./CartItem.jsx";

const Cart = ()=>{
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const handleCloseModal = () => {
        userProgressCtx.hideCart();
    }

    const handleGoToCheckout = () => {
        userProgressCtx.showCheckout();
    }


    const cartTotal = cartCtx.items.reduce((totalPrice, item)=>
        totalPrice + item.price * item.quantity, 0)
   return (
   <Modal className="cart" open={userProgressCtx.progress === 'cart'} onClose={userProgressCtx.progress === 'cart' ? handleCloseModal :null}>
    <h2>Your Cart</h2>
    <ul>
        {cartCtx.items.map((item)=>(
           <CartItem 
                key={item.id} 
                name={item.name} 
                quantity={item.quantity} 
                price={item.price} 
                onIncrese={() => cartCtx.addItem(item)}
                onDecrese={() => cartCtx.removeItem(item.id)}
            />
        ))}
    </ul>
    <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
    <p className="modal-actions">
        <Button textOnly onClick={handleCloseModal}>Close</Button>
        {cartCtx.items.length > 0 && <Button onClick={handleGoToCheckout}>Go to Checkout</Button>}
    </p>
   </Modal>
   )
}

export default Cart;