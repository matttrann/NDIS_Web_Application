import { render, screen, fireEvent } from "@testing-library/react";
import { AuthButton } from "@/components/auth-button";
import * as nextAuthMock from "next-auth/react"; // This will be redirected to your mock

describe("AuthButton", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders 'Sign in' button when there is no session", () => {
        nextAuthMock.useSession.mockReturnValue({
            data: null,
            status: "unauthenticated",
        });

        render(<AuthButton />);
        const signInButton = screen.getByRole("button", { name: /sign in/i });

        expect(signInButton).toBeInTheDocument();
        fireEvent.click(signInButton);
        expect(nextAuthMock.signIn).toHaveBeenCalled();
    });

    it("renders 'Sign out' button when user is authenticated", () => {
        nextAuthMock.useSession.mockReturnValue({
            data: {
                user: { name: "Reza", email: "reza@example.com", role: "USER" },
                expires: "some-future-date",
            },
            status: "authenticated",
        });

        render(<AuthButton />);
        const signOutButton = screen.getByRole("button", { name: /sign out/i });

        expect(signOutButton).toBeInTheDocument();
        fireEvent.click(signOutButton);
        expect(nextAuthMock.signOut).toHaveBeenCalled();
    });
});
