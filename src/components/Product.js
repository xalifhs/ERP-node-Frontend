import React, { useState } from "react";
import "./Product.css";

function Product() {
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    supplierId: "",
  });

  const fetchProducts = () => {
    if (!token) return alert("Not authenticated");

    fetch("http://localhost:3001/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setShowProducts(true);
      })
      .catch(() => alert("Failed to load products"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProduct = () => {
    if (!token) return alert("Not authenticated");

    if (!newProduct.name || !newProduct.price) {
      return alert("Name and Price are required");
    }

    // Convert price and supplierId
    const productToSend = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      supplierId: newProduct.supplierId ? Number(newProduct.supplierId) : null,
    };

    fetch("http://localhost:3001/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productToSend),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add product");
        return res.json();
      })
      .then((addedProduct) => {
        alert(`Product "${addedProduct.name}" added successfully!`);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          supplierId: "",
        });
        // Optionally refresh products list
        fetchProducts();
      })
      .catch(() => alert("Failed to add product"));
  };

  return (
    <div className="product-container">
      <h2>Products</h2>

      <div className="buttons-row">
        <button type="button" onClick={fetchProducts}>
          Get Products
        </button>
      </div>

      {showProducts && products.length === 0 && <p>No products found.</p>}

      {showProducts && products.length > 0 && (
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price (€)</th>
              <th>Category</th>
              <th>Supplier ID</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>€{p.price}</td>
                <td>{p.category}</td>
                <td>{p.supplierId ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Add New Product</h3>
      <div className="add-product-form">
        <input
          type="text"
          name="name"
          placeholder="Name *"
          value={newProduct.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleChange}
        />
        <input
          type="number"
          min="0"
          step="0.01"
          name="price"
          placeholder="Price (€) *"
          value={newProduct.price}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleChange}
        />
        <input
          type="number"
          name="supplierId"
          placeholder="Supplier ID"
          value={newProduct.supplierId}
          onChange={handleChange}
        />
        <button type="button" onClick={addProduct}>
          Add Product
        </button>
      </div>
    </div>
  );
}

export default Product;
