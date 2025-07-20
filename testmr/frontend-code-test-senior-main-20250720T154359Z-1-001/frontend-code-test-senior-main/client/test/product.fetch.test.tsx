// test/product.fetch.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import ProductPage from "../pages/product";
import React from "react";
import "@testing-library/jest-dom";
import { act } from "react"; // ✅ Correct modern import

// Global fetch mock
global.fetch = jest.fn();

const mockProductData = {
  id: 1,
  name: "Test Product",
  power: "300W",
  description: "A description",
  price: 49.99,
  quantity: 2,
  brand: "BrandX",
  weight: 500,
  height: 5,
  width: 10,
  length: 15,
  model_code: "X123",
  colour: "Red",
  img_url: "https://example.com/image.jpg",
};

describe("ProductPage data fetching", () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Clean mocks before each test
  });

  test("fetches product data with correct GraphQL query", async () => {
    const mockFetch = fetch as jest.Mock;

    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        data: { product: mockProductData },
      }),
    });

    await act(async () => {
      render(<ProductPage />);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/graphql",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1]?.body);
    expect(body.query).toContain("product(id: 1)");
  });

  test("renders product details after fetch", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        data: { product: mockProductData },
      }),
    });

    await act(async () => {
      render(<ProductPage />);
    });

    expect(await screen.findByText(mockProductData.name)).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes(mockProductData.power))).toBeInTheDocument();
    expect(screen.getByText(`£${mockProductData.price}`)).toBeInTheDocument();
    expect(screen.getByText(mockProductData.description)).toBeInTheDocument();
  });

  test("shows error message on fetch failure", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Fetch failed"));

    await act(async () => {
      render(<ProductPage />);
    });

    expect(await screen.findByText(/error fetching product/i)).toBeInTheDocument();
  });
});
