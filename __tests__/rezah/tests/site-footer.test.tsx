import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/layout/site-footer";

describe("SiteFooter", () => {
    it("should render Privacy Policy and Terms of Use links", () => {

        render(<SiteFooter className="test-class" />);

        expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
        expect(screen.getByText(/Terms of Use/i)).toBeInTheDocument();
        expect(screen.getByText(/Privacy Policy/i).closest("a")).toHaveAttribute("href", "/privacy");
        expect(screen.getByText(/Terms of Use/i).closest("a")).toHaveAttribute("href", "/terms");
    });
});
