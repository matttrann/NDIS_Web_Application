jest.doMock("@/lib/db", () => require("../mocks/db"));

import { updateUserName } from "@/actions/update-user-name";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { userNameSchema } from "@/lib/validations/user";

jest.mock("next/cache");
jest.mock("@/lib/db", () => require("../mocks/db"));
jest.mock("@/auth", () => require("../mocks/auth"));
jest.mock("@/lib/validations/user");

describe("updateUserName", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully update the user name", async () => {

        prisma.user = {
            update: jest.fn().mockResolvedValue({})
        }
        const mockAuthSession = {
            user: {
                id: "user123",
            },
        };
        auth.mockResolvedValue(mockAuthSession);
        userNameSchema.parse.mockReturnValue({ name: "New Name" });

        const result = await updateUserName("user123", { name: "New Name" });

        expect(result).toEqual({ status: "success" });
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: "user123" },
            data: { name: "New Name" },
        });
        expect(revalidatePath).toHaveBeenCalledWith("/dashboard/settings");
    });

    it("should return an error if the user is not authenticated", async () => {
        auth.mockResolvedValue(null);
        prisma.user = {
            update: jest.fn().mockResolvedValue({})
        }

        const result = await updateUserName("user123", { name: "New Name" });

        expect(result).toEqual({ status: "error" });
        expect(prisma.user.update).not.toHaveBeenCalled();
        expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error if the user ID does not match the session user ID", async () => {
        const mockAuthSession = {
            user: {
                id: "user456",
            },
        };
        auth.mockResolvedValue(mockAuthSession);
        prisma.user = {
            update: jest.fn().mockResolvedValue({})
        }

        const result = await updateUserName("user123", { name: "New Name" });

        expect(result).toEqual({ status: "error" });
        expect(prisma.user.update).not.toHaveBeenCalled();
        expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error if the userNameSchema.parse throws an error", async () => {
        const mockAuthSession = {
            user: {
                id: "user123",
            },
        };
        auth.mockResolvedValue(mockAuthSession);
        userNameSchema.parse.mockImplementation(() => {
            throw new Error("validation error");
        });
        prisma.user = {
            update: jest.fn().mockResolvedValue({})
        }

        const result = await updateUserName("user123", { name: "bad name" });

        expect(result).toEqual({ status: "error" });
        expect(prisma.user.update).not.toHaveBeenCalled();
        expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error if the prisma update throws an error", async () => {
        const mockAuthSession = {
            user: {
                id: "user123",
            },
        };
        auth.mockResolvedValue(mockAuthSession);
        userNameSchema.parse.mockReturnValue({ name: "New Name" });
        prisma.user = {
            update: jest.fn().mockImplementation(() => {
                throw new Error("database error");
            })
        }

        const result = await updateUserName("user123", { name: "New Name" });

        expect(result).toEqual({ status: "error" });
        expect(revalidatePath).not.toHaveBeenCalled();
    });
});