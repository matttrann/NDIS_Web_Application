/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";

describe("LoginPage", () => {
    it("renders title and form", () => {
        render(<LoginPage />);

        expect(screen.getByText("Welcome back")).toBeInTheDocument();
        expect(screen.getByText("Enter your email to sign in to your account")).toBeInTheDocument();
        expect(screen.getByTestId("user-auth-form")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /back/i })).toBeInTheDocument();
        expect(screen.getByTestId("icon-chevron-left")).toBeInTheDocument();
    });
});
