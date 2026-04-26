import React, { useState, useEffect, useMemo } from "react";
import Modal from "./Modal";
import "./Orders.css";

function Orders() {
  const token = localStorage.getItem("token");
  const [userType, setUserType] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [orderItems, setOrderItems] = useState([{ product: { id: "" }, amount: 1 }]);

  // Parse JWT token payload once and memoize
  const decodedToken = useMemo(() => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (decodedToken && decodedToken.type) setUserType(decodedToken.type);
  }, [decodedToken]);

  // Load products once token exists
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(setProducts)
      .catch(() => alert("Failed to load products"));
  }, [token]);

  const openPlaceModal = () => {
    setOrderItems([{ product: { id: "" }, amount: 1 }]);
    setShowPlaceModal(true);
  };

  const updateItem = (idx, field, value) => {
    setOrderItems(items =>
      items.map((item, i) =>
        i === idx
          ? {
              ...item,
              product: field === "product" ? { id: Number(value) } : item.product,
              amount: field === "amount" ? Number(value) : item.amount,
            }
          : item
      )
    );
  };

  const addItem = () => setOrderItems(items => [...items, { product: { id: "" }, amount: 1 }]);

  const removeItem = idx => setOrderItems(items => items.filter((_, i) => i !== idx));

  const submitOrder = () => {
    if (!token) return alert("Not authenticated");

    if (orderItems.some(i => !i.product.id || i.amount < 1)) {
      return alert("Please select product and valid amount for each row.");
    }

    fetch("http://localhost:8080/api/orders/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: orderItems }),
    })
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(() => {
        alert("Order placed!");
        setShowPlaceModal(false);
      })
      .catch(() => alert("Failed to place order"));
  };

  const fetchOrders = () => {
    if (!token) return alert("Not authenticated");

    fetch("http://localhost:8080/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(data => {
        setOrders(data);
        setShowOrdersModal(true);
      })
      .catch(() => alert("Failed to fetch orders"));
  };

  return (
    <div className="orders-container">
      <h2>Orders</h2>

      {/* Place Order button only for user type 'user' */}
      {userType === "user" && (
        <button type="button" onClick={openPlaceModal} disabled={products.length === 0}>
          Place Order
        </button>
      )}

      <button type="button" onClick={fetchOrders} style={{ marginLeft: 10 }}>
        See Orders
      </button>

      {/* Place Order Modal */}
      <Modal isOpen={showPlaceModal} onClose={() => setShowPlaceModal(false)} title="Place an Order">
        {orderItems.map((item, idx) => (
          <div key={idx} className="order-row">
            <select
              value={item.product.id}
              onChange={e => updateItem(idx, "product", e.target.value)}
              aria-label={`Select product for item ${idx + 1}`}
            >
              <option value="">-- Select Product --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (€{p.price})
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={item.amount}
              onChange={e => updateItem(idx, "amount", e.target.value)}
              aria-label={`Quantity for item ${idx + 1}`}
            />

            {orderItems.length > 1 && (
              <button type="button" onClick={() => removeItem(idx)} aria-label={`Remove item ${idx + 1}`}>
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addItem} style={{ marginTop: "0.5rem" }}>
          Add Another Product
        </button>

        <button type="button" onClick={submitOrder} style={{ marginLeft: 10 }}>
          Submit Order
        </button>
      </Modal>

      {/* See Orders Modal */}
      <Modal isOpen={showOrdersModal} onClose={() => setShowOrdersModal(false)} title="Your Orders">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.date}</td>
                  <td>{o.status}</td>
                  <td>€{o.totalPrice}</td>
                  <td>
                    <ul>
                      {o.orderItems.map(i => (
                        <li key={i.id}>
                          {i.product?.name || "Unknown product"} x {i.amount}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  );
}

export default Orders;
