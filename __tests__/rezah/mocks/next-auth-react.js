export const signIn = jest.fn();
export const signOut = jest.fn();
export const useSession = jest.fn(() => ({
    data: null,
    status: "unauthenticated",
    update: jest.fn(),
}));
