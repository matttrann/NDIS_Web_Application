// import { render, screen, fireEvent } from "@testing-library/react";
// import { DeleteAccountSection } from "@/components/dashboard/delete-account-section";
// import { useDeleteAccountModal } from "@/components/modals/delete-account-modal";
// import { Button } from "@/components/ui/button";
// import { Icons } from "@/components/shared/icons";
//
// // Mocks
// jest.mock("@/components/modals/delete-account-modal", () => ({
//     useDeleteAccountModal: jest.fn(),
// }));
//
// jest.mock("@/components/ui/button", () => ({
//     Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
// }));
//
// jest.mock("@/components/shared/icons", () => ({
//     Icons: {
//         trash: () => <svg />,
//         close: () => <svg />,
//     },
// }));
//
// describe("DeleteAccountSection", () => {
//     beforeEach(() => {
//         // Mocking the hook to control modal behavior
//         useDeleteAccountModal.mockReturnValue({
//             setShowDeleteAccountModal: jest.fn(),
//             DeleteAccountModal: () => <div>Modal Mocked</div>,
//         });
//     });
//
//     it("should render the section with account deletion details", () => {
//         render(<DeleteAccountSection />);
//
//         expect(screen.getByText("Delete Account")).toBeInTheDocument();
//         expect(screen.getByText("This is a danger zone - Be careful !")).toBeInTheDocument();
//         expect(screen.getByText("Are you sure ?")).toBeInTheDocument();
//         expect(screen.getByText("Permanently delete your site account")).toBeInTheDocument();
//         expect(screen.getByText("Delete Account")).toBeInTheDocument();
//     });
//
//     it("should show modal when 'Delete Account' button is clicked", () => {
//         render(<DeleteAccountSection />);
//
//         fireEvent.click(screen.getByText("Delete Account"));
//
//         // Check if modal is displayed
//         expect(screen.getByText("Modal Mocked")).toBeInTheDocument();
//     });
//
//     it("should show 'Active Subscription' label if user has a paid plan", () => {
//         // Render with userPaidPlan as true
//         render(<DeleteAccountSection />);
//
//         expect(screen.getByText("Active Subscription")).toBeInTheDocument();
//     });
//
//     it("should call setShowDeleteAccountModal when 'Delete Account' button is clicked", () => {
//         const setShowDeleteAccountModal = jest.fn();
//         useDeleteAccountModal.mockReturnValue({
//             setShowDeleteAccountModal,
//             DeleteAccountModal: () => <div>Modal Mocked</div>,
//         });
//
//         render(<DeleteAccountSection />);
//
//         fireEvent.click(screen.getByText("Delete Account"));
//
//         expect(setShowDeleteAccountModal).toHaveBeenCalledWith(true);
//     });
// });
