
import { orders } from "../data.js";
import "./styles.css";

// Calculate the total price of all items in an order.
const getOrderTotal = (order) =>
  order.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

// Select delivered orders.
const deliveredOrders = orders.filter(
  (order) => order.status === "delivered"
);

// Calculate total delivered revenue.
const totalRevenue = deliveredOrders.reduce(
  (sum, order) => sum + getOrderTotal(order),
  0
);

// Calculate the average rating for rated delivered orders.
const ratedOrders = deliveredOrders.filter(
  (order) => order.rating !== null
);

const averageRating = ratedOrders.length
  ? Number(
      (
        ratedOrders.reduce((sum, order) => sum + order.rating, 0) /
        ratedOrders.length
      ).toFixed(1)
    )
  : 0;

// Calculate the quantity sold for each menu item.
const itemQuantities = orders
  .flatMap((order) => order.items)
  .reduce((totals, item) => {
    totals[item.name] = (totals[item.name] ?? 0) + item.qty;
    return totals;
  }, {});

// Identify the best-selling item.
const bestSellingItem = Object.entries(itemQuantities).reduce(
  (best, current) => (current[1] > best[1] ? current : best)
)[0];

// Calculate delivered revenue by district.
const revenueByDistrict = deliveredOrders.reduce(
  (revenue, order) => {
    const district = order.customer.district;

    revenue[district] =
      (revenue[district] ?? 0) + getOrderTotal(order);

    return revenue;
  },
  {}
);

// Test the calculations in the browser console.
console.log("Total delivered revenue:", totalRevenue);
console.log("Number of delivered orders:", deliveredOrders.length);
console.log("Average rating:", averageRating);
console.log("Best-selling item:", bestSellingItem);
console.log("Revenue by district:", revenueByDistrict);

// Confirm that the original dataset remains unchanged.
console.assert(
  orders.length === 8,
  "Expected the original dataset to contain 8 orders."
);
