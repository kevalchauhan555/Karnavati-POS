import React, { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import MenuGrid from "../components/MenuGrid";
import CartPanel from "../components/CartPanel";
import {DEFAULT_MENU} from "./DefaultMenu"; 


export default function POSPage() {
  const [carts, setCarts] = useLocalStorage("carts", {});
  const [history, setHistory] = useLocalStorage("orderHistory", []);
  const [lastOrderNo, setLastOrderNo] = useLocalStorage("lastOrderNumber", 0);

  const [orderType, setOrderType] = useState("takeaway");
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState("Cash");

  const menu = DEFAULT_MENU;
  const currentCart = carts[orderType] || [];

  function setCartFor(type, newCart) {
    setCarts((prev) => ({ ...prev, [type]: newCart }));
  }
  function addToCart(item, qty = 1) {
    const cart = [...currentCart];
    const found = cart.find((c) => c.id === item.id);
    if (found) found.qty += qty;
    else cart.push({ ...item, qty });
    setCartFor(orderType, cart);
  }
  function changeQty(id, delta) {
    const cart = [...currentCart];
    const it = cart.find((i) => i.id === id);
    if (!it) return;
    it.qty += delta;
    if (it.qty < 1) it.qty = 1;
    setCartFor(orderType, cart);
  }
  function clearCart() {
    setCartFor(orderType, []);
  }

  function completeOrder(print = false) {
    if (currentCart.length === 0) {
      alert("Cart empty");
      return;
    }
    const total = currentCart.reduce((s, i) => s + i.price * i.qty, 0);
    const newOrderNo = parseInt(lastOrderNo || 0) + 1;
    setLastOrderNo(newOrderNo);
    const order = {
      orderNo: newOrderNo,
      time: new Date().toLocaleString(),
      type: orderType,
      items: currentCart.map((i) => `${i.name} x${i.qty}`).join(", "),
      total,
      payment,
      date: new Date().toISOString().slice(0, 10),
    };
    setHistory((prev) => [...prev, order]);
    setCartFor(orderType, []);
    if (print) printReceipt(order);
  }

  function printReceipt(order) {
    const html = buildReceiptHtml(order);
    const w = window.open("", "_blank", "height=400,width=300");
    if (!w) {
      alert("Allow popups");
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  }

  const total = currentCart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="container">
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 2 }}>
          <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu..."
              style={{
                padding: 8,
                width: "70%",
                borderRadius: 9,
                border: "1px solid #ccc",
              }}
            />
            <button onClick={() => setSearch("")} className="nav-btn">
              Clear
            </button>
          </div>
          <MenuGrid
            menu={menu}
            onAdd={addToCart}
            currentCart={currentCart}
            search={search}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div className="card" style={{ marginBottom: 8 }}>
            <div style={{ marginBottom: 8 }}>Order Type</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button
                onClick={() => setOrderType("takeaway")}
                className={`order-type-btn ${
                  orderType === "takeaway" ? "active" : ""
                }`}
              >
                Takeaway
              </button>
              {Array.from({ length: 10 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setOrderType("table" + (i + 1))}
                  className={`order-type-btn ${
                    orderType === "table" + (i + 1) ? "active" : ""
                  }`}
                >
                  T{i + 1}
                </button>
              ))}
            </div>
          </div>

          <CartPanel
            cart={currentCart}
            total={total}
            onInc={(id) => changeQty(id, 1)}
            onDec={(id) => changeQty(id, -1)}
            onClear={clearCart}
            onComplete={() => completeOrder(false)}
            onPrint={() => completeOrder(true)}
            payment={payment}
            setPayment={setPayment}
          />

          <div style={{ marginTop: 8 }} className="card">
            Currently Editing: <strong>{orderType}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildReceiptHtml(order) {
  const rows = order.items.split(", ").map((i) => {
    const [nameQty, qty] = [i.split(" x")[0], i.split(" x")[1]];
    const qtyN = parseInt(qty) || 1;
    const menuItem = DEFAULT_MENU.find((m) => m.name === nameQty);
    const price = menuItem ? menuItem.price * qtyN : 0;
    return `<tr>
              <td style="padding:2px 0; font-size:12px;">${nameQty}</td>
              <td style="padding:2px 0; font-size:12px; text-align:center;">${qtyN}</td>
              <td style="padding:2px 0; font-size:12px; text-align:right;">₹${price}</td>
            </tr>`;
  });

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Receipt</title>
  <style>
    body {
      font-family: monospace, Arial, sans-serif;
      padding: 8px;
      font-size: 12px;
      width: 280px;
      margin: 0 auto;
    }
    h2 {
      text-align: center;
      margin: 0 0 10px 0;
      font-size: 16px;
    }
    .info {
      margin-bottom: 10px;
      font-size: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    th, td {
      border-bottom: 1px dashed #000;
      padding: 2px 0;
    }
    th {
      text-align: left;
      font-weight: bold;
      font-size: 12px;
    }
    td {
      font-size: 12px;
    }
    .total-row td {
      border-top: 1px solid #000;
      font-weight: bold;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h2>Karnavati Dabeli & Vadapav Botad</h2>
  <div class="info">Order No: ${order.orderNo}</div>
  <div class="info">Date/Time: ${order.time}</div>
  <div class="info">Order Type: ${order.type}</div>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${rows.join("")}
      <tr class="total-row">
        <td>Total</td>
        <td></td>
        <td>₹${order.total}</td>
      </tr>
      <tr class="total-row">
        <td>Payment</td>
        <td></td>
        <td>${order.payment}</td>
      </tr>
    </tbody>
  </table>
  <div style="text-align:center; font-size:10px; margin-top:10px;">
    Thank you for your purchase!
  </div>
</body>
</html>`;
}
