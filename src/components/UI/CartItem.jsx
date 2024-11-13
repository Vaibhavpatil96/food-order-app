import {currencyFormatter} from '../../util/formatting.js'

const CartItem = ({name, quantity, price, onIncrese, onDecrese}) =>{   
return <li className="cart-item">
    <p>
        {name} - {quantity} x {currencyFormatter.format(price)}
    </p>
    <p className="cart-item-actions">
        <button onClick={onDecrese}>-</button>
        <span>{quantity}</span>
        <button onClick={onIncrese}>+</button>
    </p>
</li>
}

export default CartItem;