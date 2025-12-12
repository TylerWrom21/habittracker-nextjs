import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth/jwt";
import { hashPassword, comparePassword } from "@/lib/auth/hash";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db/mongodb";
import { getErrorResponse } from "@/lib/utils/error-handler";

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const decoded = await verifyAuth();
    if (!decoded) {
      return NextResponse.json(
        getErrorResponse("Unauthorized"),
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        getErrorResponse("User not found"),
        { status: 404 }
      );
    }

    // Parse request body
    const body: ChangePasswordRequest = await request.json();

    // Validate inputs
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        getErrorResponse("All fields are required"),
        { status: 400 }
      );
    }

    if (body.newPassword.length < 8) {
      return NextResponse.json(
        getErrorResponse("Password must be at least 8 characters"),
        { status: 400 }
      );
    }

    // Verify current password
    const isPasswordValid = await comparePassword(
      body.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        getErrorResponse("Current password is incorrect"),
        { status: 401 }
      );
    }

    // Prevent using same password
    const isSamePassword = await comparePassword(
      body.newPassword,
      user.password
    );

    if (isSamePassword) {
      return NextResponse.json(
        getErrorResponse("New password must be different from current password"),
        { status: 400 }
      );
    }

    // Hash and save new password
    user.password = await hashPassword(body.newPassword);
    user.updatedAt = new Date();
    await user.save();

    return NextResponse.json({
      message: "Password changed successfully",
    });
  } catch {
    return NextResponse.json(
      getErrorResponse("Internal server error"),
      { status: 500 }
    );
  }
}
