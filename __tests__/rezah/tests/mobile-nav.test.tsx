/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useSelectedLayoutSegment } from "next/navigation";
import { NavMobile } from "@/components/layout/mobile-nav";

// Mock Next.js & Auth hooks
jest.mock("next/navigation", () => ({
    useSelectedLayoutSegment: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
    useSession: jest.fn(),
}));

// Mock Configs
jest.mock("@/config/docs", () => ({
    docsConfig: {
        mainNav: [
            { title: "Docs Home", href: "/docs" },
            { title: "Guide", href: "/docs/guide" },
        ],
    },
}));

jest.mock("@/config/marketing", () => ({
    marketingConfig: {
        mainNav: [
            { title: "Home", href: "/" },
            { title: "Pricing", href: "/pricing" },
        ],
    },
}));

jest.mock("@/lib/utils", () => ({
    cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

describe("NavMobile", () => {
    beforeEach(() => {
        document.body.innerHTML = ""; // Reset body styles
        (useSession as jest.Mock).mockReturnValue({ data: null });
    });

    it("renders menu icon initially", () => {
        (useSelectedLayoutSegment as jest.Mock).mockReturnValue(null);
        render(<NavMobile />);
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("opens menu on button click and displays links", () => {
        (useSelectedLayoutSegment as jest.Mock).mockReturnValue(null);
        render(<NavMobile />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Pricing")).toBeInTheDocument();
    });

    it("uses docs nav if segment is 'docs'", () => {
        (useSelectedLayoutSegment as jest.Mock).mockReturnValue("docs");
        render(<NavMobile />);
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText("Docs Home")).toBeInTheDocument();
        expect(screen.getByText("Guide")).toBeInTheDocument();
    });

    it("shows login link when no session", () => {
        (useSelectedLayoutSegment as jest.Mock).mockReturnValue(null);
        (useSession as jest.Mock).mockReturnValue({ data: null });
        render(<NavMobile />);
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it("shows admin and dashboard links when session has admin role", () => {
        (useSelectedLayoutSegment as jest.Mock).mockReturnValue(null);
        (useSession as jest.Mock).mockReturnValue({
            data: { user: { role: "ADMIN" } },
        });
        render(<NavMobile />);
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText("Admin")).toBeInTheDocument();
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("shows only dashboard when session has non-admin role", () => {
        (useSelectedLayoutSegment as jest.Mock).mockReturnValue(null);
        (useSession as jest.Mock).mockReturnValue({
            data: { user: { role: "USER" } },
        });
        render(<NavMobile />);
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    });
});
