import { UserAuthForm } from "@/components/forms/user-auth-form";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

jest.mock("next-auth/react", () => require("../mocks/next-auth-react"));
jest.mock("next/navigation", () => ({
    useSearchParams: jest.fn(),
}));
jest.mock("sonner");

describe("UserAuthForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the form elements correctly", () => {
        render(<UserAuthForm />);
        expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign in with email/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign in with google/i })).toBeInTheDocument();
    });

    it("shows success toast on successful email sign-in", async () => {
        (signIn as jest.Mock).mockResolvedValue({ ok: true });
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams("from=/dashboard"));

        render(<UserAuthForm />);
        const emailInput = screen.getByPlaceholderText("name@example.com");
        const submitButton = screen.getByRole("button", { name: /sign in with email/i });

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(signIn).toHaveBeenCalledWith("resend", {
                email: "test@example.com",
                redirect: false,
                callbackUrl: "/dashboard",
            });
            expect(toast.success).toHaveBeenCalledWith("Check your email", expect.any(Object));
        });
    });

    it("shows error toast on failed email sign-in", async () => {
        (signIn as jest.Mock).mockResolvedValue({ ok: false });

        render(<UserAuthForm />);
        const emailInput = screen.getByPlaceholderText("name@example.com");
        const submitButton = screen.getByRole("button", { name: /sign in with email/i });

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Something went wrong.", expect.any(Object));
        });
    });

    it("shows success toast on successful Google sign-in", async () => {
        (signIn as jest.Mock).mockResolvedValue({ ok: true });
        render(<UserAuthForm />);
        const googleButton = screen.getByRole("button", { name: /sign in with google/i });
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(signIn).toHaveBeenCalledWith("google", { callbackUrl: "/dashboard", redirect: false });
            expect(toast.success).toHaveBeenCalledWith("Logged in successfully");
        });
    });

    it("shows error toast on failed Google sign-in", async () => {
        (signIn as jest.Mock).mockResolvedValue({ error: "Authentication failed" });
        render(<UserAuthForm />);
        const googleButton = screen.getByRole("button", { name: /sign in with google/i });
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Authentication failed");
        });
    });
});
