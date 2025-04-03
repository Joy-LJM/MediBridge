import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../pages/Login";
import axios from "axios";
import { vi } from "vitest";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SUCCESS_CODE } from "../../constant";

// Mock axios to simulate API calls
vi.mock("axios");

describe("Login Component", () => {
  beforeEach(() => {
    // Mock localStorage before each test
    globalThis.localStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
  });

  afterEach(() => {
    // Reset mocks after each test
    vi.restoreAllMocks();
  });

  it("should render login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Check if email and password fields are present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("should show error if email or password is empty", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Submit the form without filling fields
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    
    // Check if the error message is shown
    await waitFor(() =>
      expect(
        screen.getByText(/Please input your email or password before submit!/i)
      ).toBeInTheDocument()
    );
  });

  it("should submit the form and handle success", async () => {
    const mockResponse = {
      data: {
        code: SUCCESS_CODE,
        message: "Login successful",
        user: { id: 1, username: "testuser" },
      },
    };
    // Mock the axios post request
    axios.post.mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    // Fill the email and password fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    // Wait for the success message and localStorage call
    await waitFor(() => {
      expect(screen.getByText("Login successful")).toBeInTheDocument();
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "userInfo",
        JSON.stringify(mockResponse.data.user)
      );
    });
  });

  it("should show error message if login fails", async () => {
    const mockResponse = {
      data: {
        code: 400,
        message: "Invalid credentials",
      },
    };

    // Mock the axios post request to simulate error
    axios.post.mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill the email and password fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Check if the toast error message is shown
    await waitFor(() =>
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
    );
  });
});
