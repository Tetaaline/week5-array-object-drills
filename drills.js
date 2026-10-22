
import { orders } from "./data.js";

const ORIGINAL = JSON.stringify(orders);

// Station 1 — Warm-up

// 1. Array of all order IDs.
const orderIds = orders.map(({ id }) => id);
console.log("1. Order IDs:", orderIds);

// 2. Array of customer names (duplicates allowed).
const customerNames = orders.map(({ customer }) => customer.name);
console.log("2. Customer names:", customerNames);

// 3. All delivered orders.
const deliveredOrders = orders.filter(
  ({ status }) => status === "delivered"
);
console.log("3. Delivered orders:", deliveredOrders);

// 4. All orders from Gasabo.
const gasaboOrders = orders.filter(
  ({ customer }) => customer.district === "Gasabo"
);
console.log("4. Gasabo orders:", gasaboOrders);

// 5. The order with ID 106.
const order106 = orders.find(({ id }) => id === 106);
console.log("5. Order 106:", order106);

// 6. Does any order have a rating of 3 or lower?
const hasLowRating = orders.some(
  ({ rating }) => rating !== null && rating <= 3
);
console.log("6. Has rating <= 3:", hasLowRating);

// 7. Are all pending orders unrated?
const pendingOrdersUnrated = orders
  .filter(({ status }) => status === "pending")
  .every(({ rating }) => rating === null);
console.log("7. Pending orders are unrated:", pendingOrdersUnrated);

// 8. Unique customer names (Set + spread).
const uniqueCustomerNames = [...new Set(customerNames)];
console.log("8. Unique customer names:", uniqueCustomerNames);

// Verify that the original dataset has not changed.
console.log(
  "Original data preserved:",
  JSON.stringify(orders) === ORIGINAL
);


 // Station 2 — Calculations with reduce

// Helper: calculate the total price of one order.
const orderTotal = ({ items }) =>
  items.reduce((sum, { price, qty }) => sum + price * qty, 0);

// 9. Add a total to every order without modifying the original objects.
const ordersWithTotals = orders.map((order) => ({
  ...order,
  total: orderTotal(order)
}));

console.log(
  "9. Orders with totals:",
  ordersWithTotals.map(({ id, total }) => ({ id, total }))
);

// 10. Total revenue from delivered orders only.
const deliveredRevenue = orders
  .filter(({ status }) => status === "delivered")
  .reduce((sum, order) => sum + orderTotal(order), 0);

console.log("10. Delivered revenue:", deliveredRevenue);

// 11. Average rating, ignoring null values, rounded to one decimal.
const ratedOrders = orders.filter(({ rating }) => rating !== null);

const averageRating = Number(
  (
    ratedOrders.reduce((sum, { rating }) => sum + rating, 0) /
    ratedOrders.length
  ).toFixed(1)
);

console.log("11. Average rating:", averageRating);

// 12. Total quantity of Brochettes sold across all orders.
const brochetteQuantity = orders
  .flatMap(({ items }) => items)
  .filter(({ name }) => name === "Brochette")
  .reduce((sum, { qty }) => sum + qty, 0);

console.log("12. Brochettes sold:", brochetteQuantity);

// 13. The single most expensive order.
const mostExpensiveOrder = ordersWithTotals.reduce(
  (mostExpensive, order) =>
    order.total > mostExpensive.total ? order : mostExpensive
);

console.log(
  "13. Most expensive order:",
  {
    id: mostExpensiveOrder.id,
    customer: mostExpensiveOrder.customer.name,
    total: mostExpensiveOrder.total
  }
);

// 14. Number of orders per status.
const ordersByStatus = orders.reduce(
  (counts, { status }) => ({
    ...counts,
    [status]: (counts[status] ?? 0) + 1
  }),
  {}
);

console.log("14. Orders by status:", ordersByStatus);
