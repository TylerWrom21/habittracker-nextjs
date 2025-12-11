import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth/jwt";
import { hashPassword, comparePassword } from "@/lib/auth/hash";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db/mongodb";
import { ApiError, createErrorResponse } from "@/lib/utils/responses";

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const decoded = await verifyAuth();
    if (!decoded) {
      return createErrorResponse("Unauthorized", 401);
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    // Parse request body
    const body: ChangePasswordRequest = await request.json();

    // Validate inputs
    if (!body.currentPassword || !body.newPassword) {
      return createErrorResponse("All fields are required", 400);
    }

    if (body.newPassword.length < 8) {
      return createErrorResponse("Password must be at least 8 characters", 400);
    }

    // Verify current password
    const isPasswordValid = await comparePassword(
      body.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return createErrorResponse("Current password is incorrect", 401);
    }

    // Prevent using same password
    const isSamePassword = await comparePassword(
      body.newPassword,
      user.password
    );

    if (isSamePassword) {
      return createErrorResponse(
        "New password must be different from current password",
        400
      );
    }

    // Hash and save new password
    user.password = await hashPassword(body.newPassword);
    user.updatedAt = new Date();
    await user.save();

    return NextResponse.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    if (error instanceof ApiError) {
      return createErrorResponse((error as ApiError).message, (error as ApiError).statusCode);
    }
    return createErrorResponse("Internal server error", 500);
  }
}
