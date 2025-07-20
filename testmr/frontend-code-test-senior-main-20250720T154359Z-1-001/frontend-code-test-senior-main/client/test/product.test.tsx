// __tests__/product.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductPage from "../pages/product";
import '@testing-library/jest-dom';

// Mock fetch for GraphQL
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: {
            product: {
              id: 1,
              name: "Eco Kettle",
              power: "3000W",
              description: "A smart energy-efficient kettle.",
              price: 49.99,
              quantity: 1,
              brand: "EcoBrand",
              weight: 1200,
              height: 20,
              width: 15,
              length: 25,
              model_code: "EKO-3000",
              colour: "Silver",
              img_url: "https://example.com/kettle.jpg",
            },
          },
        }),
    })
  ) as jest.Mock;
});

describe("ProductPage", () => {
  test("renders product details and allows quantity adjustment", async () => {
    render(<ProductPage />);

    await waitFor(() => screen.getByText("Eco Kettle"));
    expect(screen.getByText("Eco Kettle")).toBeInTheDocument();
    expect(screen.getByText("3000W // Packet of 1")).toBeInTheDocument();
    expect(screen.getByText("£49.99")).toBeInTheDocument();

    const qtyDisplay = screen.getByText("1");
    const plusBtn = screen.getByText("+");
    const minusBtn = screen.getByText("−");

    fireEvent.click(plusBtn);
    expect(screen.getByText("2")).toBeInTheDocument();

    fireEvent.click(minusBtn);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("adds to cart and updates badge count", async () => {
    render(<ProductPage />);

    await waitFor(() =>
      screen.getByRole("button", { name: /add to cart/i })
    );

    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addToCartBtn);

    const cartBadge = screen.getByTestId("cart-badge");
    expect(cartBadge).toHaveTextContent("1");
  });
});
