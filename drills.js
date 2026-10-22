
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


// Station 3 — Grouping and ranking

// 15. Revenue per district from delivered orders.
const revenueByDistrict = orders
  .filter(({ status }) => status === "delivered")
  .reduce((revenue, { customer, ...order }) => ({
    ...revenue,
    [customer.district]:
      (revenue[customer.district] ?? 0) + orderTotal(order)
  }), {});

console.log("15. Revenue by district:", revenueByDistrict);

// 16. Group orders by date and calculate count and revenue.
const ordersGroupedByDate = Object.groupBy(
  orders,
  ({ date }) => date
);

const dailySummary = Object.entries(ordersGroupedByDate).map(
  ([date, dailyOrders]) => ({
    date,
    count: dailyOrders.length,
    revenue: dailyOrders.reduce(
      (sum, order) => sum + orderTotal(order),
      0
    )
  })
);

console.log("16. Daily summary:", dailySummary);

// 17. Top 3 best-selling items by quantity.
const itemQuantities = orders
  .flatMap(({ items }) => items)
  .reduce((totals, { name, qty }) => ({
    ...totals,
    [name]: (totals[name] ?? 0) + qty
  }), {});

const topThreeItems = Object.entries(itemQuantities)
  .map(([name, qty]) => ({ name, qty }))
  .toSorted((a, b) => b.qty - a.qty)
  .slice(0, 3);

console.log("17. Top 3 items:", topThreeItems);

// 18. Each customer's number of orders and total spent.
const customerSummary = orders.reduce(
  (summary, { customer, ...order }) => {
    const name = customer.name;
    const existing = summary[name] ?? { name, orders: 0, spent: 0 };

    return {
      ...summary,
      [name]: {
        ...existing,
        orders: existing.orders + 1,
        spent: existing.spent + orderTotal(order)
      }
    };
  },
  {}
);

const customerRanking = Object.values(customerSummary)
  .toSorted((a, b) => b.spent - a.spent);

console.log("18. Customer ranking:", customerRanking);

// 19. Menu price list, built with Object.fromEntries.
const menuPrices = Object.fromEntries(
  orders
    .flatMap(({ items }) => items)
    .map(({ name, price }) => [name, price])
);

console.log("19. Menu prices:", menuPrices);

// Station 4 — Immutable updates

// 20. Mark a pending order as delivered.
const markDelivered = (orders, id) =>
  orders.map((order) =>
    order.id === id && order.status === "pending"
      ? { ...order, status: "delivered" }
      : order
  );

// 21. Rate an order only if it has been delivered.
const rateOrder = (orders, id, rating) =>
  orders.map((order) =>
    order.id === id && order.status === "delivered"
      ? { ...order, rating }
      : order
  );

// 22. Update an order's nested customer district.
const changeDistrict = (orders, id, district) =>
  orders.map((order) =>
    order.id === id
      ? {
          ...order,
          customer: { ...order.customer, district }
        }
      : order
  );

// 23. Add an item to an order.
const addItem = (orders, id, item) =>
  orders.map((order) =>
    order.id === id
      ? { ...order, items: [...order.items, item] }
      : order
  );

// 24. Remove cancelled orders.
const removeCancelled = (orders) =>
  orders.filter(({ status }) => status !== "cancelled");

// 25. Apply a discount to every item price, rounded to the nearest
// whole currency unit.
const applyDiscount = (orders, percent) =>
  orders.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      price: Math.round(item.price * (1 - percent / 100))
    }))
  }));

// Test Station 4 — all results should leave the original orders unchanged.

console.log(
  "20. Mark order 105 delivered:",
  markDelivered(orders, 105).find(({ id }) => id === 105)
);

console.log(
  "21. Rate delivered order 101:",
  rateOrder(orders, 101, 5).find(({ id }) => id === 101)
);

console.log(
  "21. Rate pending order 105:",
  rateOrder(orders, 105, 4).find(({ id }) => id === 105)
);

console.log(
  "22. Change order 101 district:",
  changeDistrict(orders, 101, "Kicukiro").find(({ id }) => id === 101)
);

console.log(
  "23. Add item to order 102:",
  addItem(orders, 102, { name: "Juice", price: 1500, qty: 1 })
    .find(({ id }) => id === 102)
);

console.log(
  "24. Remaining order count:",
  removeCancelled(orders).length
);

console.log(
  "25. Discounted order 101:",
  applyDiscount(orders, 10).find(({ id }) => id === 101)
);

// Final immutability verification.
console.log(
  "Original data preserved:",
  JSON.stringify(orders) === ORIGINAL
);
