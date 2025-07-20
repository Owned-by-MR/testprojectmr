import React, { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  power: string;
  description: string;
  price: number;
  quantity: number;
  brand: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  model_code: string;
  colour: string;
  img_url: string;
};

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("http://localhost:3001/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                product(id: 1) {
                  id
                  name
                  power
                  description
                  price
                  quantity
                  brand
                  weight
                  height
                  width
                  length
                  model_code
                  colour
                  img_url
                }
              }
            `,
          }),
        });

        const result = await response.json();
        if (!result.data?.product) {
          throw new Error("Invalid response structure");
        }

        setProduct(result.data.product);
      } catch (err) {
        // console.log("Error fetching product:", err);
        setError("Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (error) return <div className="text-white p-10">{error}</div>;
  if (!product) return null;

  const dimensions = `${product.length} x ${product.width} x ${product.height}`;

  return (
    <div className="container">
      <header className="header">
        <a href="http://localhost:3000"><img
          src="https://static.octopuscdn.com/logos/logo.svg"
          alt="Octopus Energy"
          className="logo"
        /></a>

        <div style={{ position: "relative" }}>
          <svg className="icon" fill="none" stroke="white" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h18l-1 13H4L3 3z"
            />
          </svg>

          {cartCount > 0 && (
            <span
              data-testid="cart-badge"
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                background: "var(--btn-hover)",
                color: "white",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                padding: "0 6px",
                lineHeight: "1.25rem",
              }}
            >
              {cartCount}
            </span>
          )}
        </div>
      </header>

      <div className="image-box">
        <img
          src={product.img_url}
          alt={product.name}
          className="product-image"
        />
      </div>

      <div className="product-name">{product.name}</div>
      <div className="product-sub">
        {product.power} // Packet of {product.quantity}
      </div>
      <div className="price">£{product.price.toFixed(2)}</div>

      <div className="qty-row">
        <span style={{ fontSize: "0.8rem" }}>Qty</span>
        <button
          className="qty-button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >
          −
        </button>
        <span>{quantity}</span>
        <button
          className="qty-button plus"
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </button>
      </div>

      <button
        className="add-cart-btn"
        onClick={() => setCartCount(cartCount + quantity)}
      >
        Add to cart
      </button>

      <div className="section-title">Description</div>
      <p className="description">{product.description}</p>

      <div className="section-title">Specifications</div>
      <div className="specs-grid">
        <div>
          <strong>Brand</strong>
        </div>
        <div>{product.brand}</div>
        <div>
          <strong>Item weight (g)</strong>
        </div>
        <div>{product.weight}</div>
        <div>
          <strong>Dimensions (cm)</strong>
        </div>
        <div>{dimensions}</div>
        <div>
          <strong>Item Model number</strong>
        </div>
        <div>{product.model_code}</div>
        <div>
          <strong>Colour</strong>
        </div>
        <div>{product.colour}</div>
      </div>

      <footer className="footer">
        Octopus Energy Ltd is a company registered in England and Wales.
        <br />
        Registered number: 09263424. Registered office: 33 Holborn, London,
        EC1N 2HT.
        <br />
        Trading office: 20–24 Broadwick Street, London, W1F 8HT
      </footer>

    {error && (
      <div className="error-message" role="alert">
        {error}
      </div>
    )}
    </div>
  );
}
