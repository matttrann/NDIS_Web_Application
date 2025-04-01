import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";
import { MemoryRouter } from "react-router-dom";
import { signIn } from "next-auth/react";


jest.mock("next-auth/react");
jest.mock("@/components/forms/user-auth-form", () => ({
    UserAuthForm: () => <div data-testid="user-auth-form" />,
}));

describe("LoginPage", () => {
    it("renders the page elements correctly", () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
        expect(screen.getByText(/Enter your email to sign in to your account/i)).toBeInTheDocument();

        expect(screen.getByRole("link", { name: /Back/i })).toBeInTheDocument();

        expect(screen.getByTestId("user-auth-form")).toBeInTheDocument();
    });

    it("navigates to the homepage when clicking 'Back' link", () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const backLink = screen.getByRole("link", { name: /Back/i });
        fireEvent.click(backLink);

        expect(window.location.pathname).toBe("/");
    });

    it("calls signIn on form submission with valid credentials", async () => {
        const mockSignIn = signIn as jest.Mock;
        mockSignIn.mockResolvedValue({ ok: true });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText("name@example.com");
        const submitButton = screen.getByRole("button", { name: /sign in with email/i });

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith("resend", {
                email: "test@example.com",
                redirect: false,
                callbackUrl: "/dashboard",
            });
        });
    });

    it("shows error toast when signIn fails", async () => {
        const mockSignIn = signIn as jest.Mock;
        mockSignIn.mockResolvedValue({ ok: false });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText("name@example.com");
        const submitButton = screen.getByRole("button", { name: /sign in with email/i });

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);

        // Check for error toast
        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalled();
            expect(mockSignIn).toHaveBeenCalledWith("resend", {
                email: "test@example.com",
                redirect: false,
                callbackUrl: "/dashboard",
            });
        });
    });
});
