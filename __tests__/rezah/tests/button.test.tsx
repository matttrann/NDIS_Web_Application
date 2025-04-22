// import React from "react";
// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { Button } from "@/components/ui/button";
//
// // Mock environment variables
// // jest.mock('@/lib/utils/env.mjs', () => require("../mocks/env.mock.js")); // Import the mock env file
// jest.mock('../mocks/env.mock')
//
// describe("Button Component", () => {
//     test("renders correctly with default props", () => {
//         render(<Button>Click Me</Button>);
//         const button = screen.getByRole("button", { name: /click me/i });
//         expect(button).toBeInTheDocument();
//     });
//
//     test("applies the correct variant class", () => {
//         const { rerender } = render(<Button variant="destructive">Delete</Button>);
//         let button = screen.getByRole("button", { name: /delete/i });
//
//         expect(button).toHaveClass("bg-destructive text-destructive-foreground");
//
//         rerender(<Button variant="outline">Outline</Button>);
//         button = screen.getByRole("button", { name: /outline/i });
//
//         expect(button).toHaveClass("border border-input hover:bg-accent");
//     });
//
//     test("triggers onClick event when clicked", async () => {
//         const handleClick = jest.fn();
//         render(<Button onClick={handleClick}>Click</Button>);
//
//         const button = screen.getByRole("button", { name: /click/i });
//         await userEvent.click(button);
//
//         expect(handleClick).toHaveBeenCalledTimes(1);
//     });
//
//     test("renders with different sizes", () => {
//         const { rerender } = render(<Button size="sm">Small</Button>);
//         let button = screen.getByRole("button", { name: /small/i });
//         expect(button).toHaveClass("h-9 px-3");
//
//         rerender(<Button size="lg">Large</Button>);
//         button = screen.getByRole("button", { name: /large/i });
//         expect(button).toHaveClass("h-11 px-8");
//     });
//
//     test("renders with disabled state", () => {
//         render(<Button disabled>Disabled</Button>);
//         const button = screen.getByRole("button", { name: /disabled/i });
//
//         expect(button).toBeDisabled();
//         expect(button).toHaveClass("disabled:opacity-50 disabled:cursor-not-allowed");
//     });
// });
