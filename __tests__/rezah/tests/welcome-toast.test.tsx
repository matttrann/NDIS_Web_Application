import { render } from "@testing-library/react";
import { WelcomeToast } from "@/components/welcome-toast";
import { toast } from "../mocks/sonner";

jest.mock("sonner", () => require("../mocks/sonner"));

describe("WelcomeToast", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows welcome toast with username", () => {
        render(<WelcomeToast username="Capstone T234" />);
        expect(toast.success).toHaveBeenCalledWith("Welcome, Capstone T234!");
    });

    it("shows generic welcome toast if no username is provided", () => {
        render(<WelcomeToast />);
        expect(toast.success).toHaveBeenCalledWith("Welcome!");
    });

    it("only shows the toast once, even on re-render", () => {
        const { rerender } = render(<WelcomeToast username="T234" />);
        rerender(<WelcomeToast username="T234" />);
        expect(toast.success).toHaveBeenCalledTimes(1);
    });
});

