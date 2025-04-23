import { updateUserRole } from "@/actions/update-user-role";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { userRoleSchema } from "@/lib/validations/user";
import { UserRole } from "@prisma/client";

jest.mock("next/cache");
jest.mock("@/lib/db", () => require("../mocks/db"));
jest.mock("@/auth", () => require("../mocks/auth"));
jest.mock("@/lib/validations/user");

describe("updateUserRole", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully update the user role", async () => {

        prisma.user.update = jest.fn().mockResolvedValue({});

        const mockAuthSession = { user: { id: "user123" } };
        auth.mockResolvedValue(mockAuthSession);

        userRoleSchema.parse.mockReturnValue({ role: UserRole.ADMIN });

        const result = await updateUserRole("user123", { role: UserRole.ADMIN });

        expect(result).toEqual({ status: "success" });
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: "user123" },
            data: { role: UserRole.ADMIN },
        });
        expect(revalidatePath).toHaveBeenCalledWith("/dashboard/settings");
    });

    it("should return an error if the user is not authenticated", async () => {
        auth.mockResolvedValue(null);
        prisma.user.update = jest.fn();

        const result = await updateUserRole("user123", { role: UserRole.ADMIN });

        expect(result).toEqual({ status: "error" });
        expect(prisma.user.update).not.toHaveBeenCalled();
        expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error if the user ID does not match the session user ID", async () => {
        const mockAuthSession = { user: { id: "user456" } };
        auth.mockResolvedValue(mockAuthSession);
        prisma.user.update = jest.fn();

        const result = await updateUserRole("user123", { role: UserRole.ADMIN });

        expect(result).toEqual({ status: "error" });
        expect(prisma.user.update).not.toHaveBeenCalled();
        expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error if the userRoleSchema.parse throws an error", async () => {
        const mockAuthSession = { user: { id: "user123" } };
        auth.mockResolvedValue(mockAuthSession);

        userRoleSchema.parse.mockImplementation(() => {
            throw new Error("validation error");
        });

        const result = await updateUserRole("user123", { role: "INVALID_ROLE" as UserRole });

        expect(result).toEqual({ status: "error" });
        expect(prisma.user.update).not.toHaveBeenCalled();
        expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error if prisma update throws an error", async () => {
        const mockAuthSession = { user: { id: "user123" } };
        auth.mockResolvedValue(mockAuthSession);

        userRoleSchema.parse.mockReturnValue({ role: UserRole.ADMIN });

        prisma.user.update = jest.fn().mockImplementation(() => {
            throw new Error("database error");
        });

        const result = await updateUserRole("user123", { role: UserRole.ADMIN });

        expect(result).toEqual({ status: "error" });
        expect(revalidatePath).not.toHaveBeenCalled();
    });
});
