import { orderApi } from "../api/orderApi";
import { paymentApi } from "../api/paymentApi";

export async function checkout({
  cartItems,
  orderType,
  pickupTime,
  notes,
  paymentMethod,
  orderSource,
  customerName,
  tableNumber
}) {
  const order = await orderApi.createOrder({
    orderSource,
    customerName,
    tableNumber,
    orderType,
    pickupTime,
    notes,
    items: cartItems.map((item) => ({
      itemId: item.id,
      quantity: item.quantity
    }))
  });

  const payment = await paymentApi.createPayment({
    orderId: order.orderId,
    amount: order.totalAmount,
    paymentMethod
  });

  return { order, payment };
}
