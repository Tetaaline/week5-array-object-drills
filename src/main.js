
import { orders } from "../data.js";
import "./styles.css";

// Calculate the total price of all items in an order.
const getOrderTotal = (order) =>
  order.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

// Calculate delivered order statistics.
const deliveredOrders = orders.filter(
  (order) => order.status === "delivered"
);

const totalRevenue = deliveredOrders.reduce(
  (sum, order) => sum + getOrderTotal(order),
  0
);

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

// Calculate total quantities sold for each menu item.
const itemQuantities = orders
  .flatMap((order) => order.items)
  .reduce((totals, item) => {
    totals[item.name] = (totals[item.name] ?? 0) + item.qty;
    return totals;
  }, {});

const bestSellingItem = Object.entries(itemQuantities).reduce(
  (best, current) => current[1] > best[1] ? current : best
)[0];

const bestSellingQuantity = itemQuantities[bestSellingItem];

// Format numbers for display.
const formatCurrency = (amount) =>
  `${amount.toLocaleString("en-US")} RWF`;

// Render the dashboard header and summary cards.
document.querySelector("#app").innerHTML = `
  <main class="dashboard">
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">ORDER MANAGEMENT</p>
        <h1>Order Analytics</h1>
        <p class="header-description">
          Monitor revenue, customer ratings, and sales performance.
        </p>
      </div>

      <div class="header-date">
        <span class="status-dot"></span>
        <span>October 2026</span>
      </div>
    </header>

    <section class="summary-section" aria-labelledby="summary-title">
      <div class="section-heading">
        <div>
          <h2 id="summary-title">Overview</h2>
          <p>Your order performance at a glance.</p>
        </div>
        <span class="orders-count">${orders.length} total orders</span>
      </div>

      <div class="stats-grid">
        <article class="stat-card">
          <div class="stat-card-top">
            <span class="stat-label">Delivered revenue</span>
            <span class="stat-icon revenue-icon" aria-hidden="true">$</span>
          </div>
          <p class="stat-value">${formatCurrency(totalRevenue)}</p>
          <p class="stat-footnote">From completed orders</p>
        </article>

        <article class="stat-card">
          <div class="stat-card-top">
            <span class="stat-label">Delivered orders</span>
            <span class="stat-icon orders-icon" aria-hidden="true">✓</span>
          </div>
          <p class="stat-value">${deliveredOrders.length}</p>
          <p class="stat-footnote">Successfully completed</p>
        </article>

        <article class="stat-card">
          <div class="stat-card-top">
            <span class="stat-label">Average rating</span>
            <span class="stat-icon rating-icon" aria-hidden="true">★</span>
          </div>
          <p class="stat-value">${averageRating}<span class="stat-unit"> / 5</span></p>
          <p class="stat-footnote">Customer feedback</p>
        </article>

        <article class="stat-card">
          <div class="stat-card-top">
            <span class="stat-label">Best-selling item</span>
            <span class="stat-icon item-icon" aria-hidden="true">↗</span>
          </div>
          <p class="stat-value stat-value-name">${bestSellingItem}</p>
          <p class="stat-footnote">${bestSellingQuantity} units sold</p>
        </article>
      </div>
    </section>
  </main>
`;

// Confirm that the original dataset has not changed.
console.assert(
  orders.length === 8,
  "Expected the original dataset to contain 8 orders."
);
