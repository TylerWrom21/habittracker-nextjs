import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth/jwt";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db/mongodb";
import { ApiError, createErrorResponse } from "@/lib/utils/responses";

interface UpdateProfileRequest {
  name?: string;
  email?: string;
  settings?: {
    timezone?: string;
    theme?: "light" | "dark" | "system";
    dateFormat?: string;
  };
}

export async function PATCH(request: NextRequest) {
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
    const body: UpdateProfileRequest = await request.json();

    // Validate and update name
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim().length === 0) {
        return createErrorResponse("Name must be a non-empty string", 400);
      }
      if (body.name.length > 60) {
        return createErrorResponse("Name must be 60 characters or less", 400);
      }
      user.name = body.name.trim();
    }

    // Validate and update email
    if (body.email !== undefined) {
      if (typeof body.email !== "string" || !body.email.includes("@")) {
        return createErrorResponse("Invalid email address", 400);
      }

      // Check if email already exists
      const existingUser = await User.findOne({
        email: body.email.toLowerCase(),
        _id: { $ne: decoded.userId },
      });

      if (existingUser) {
        return createErrorResponse("Email already in use", 400);
      }

      user.email = body.email.toLowerCase();
    }

    // Update settings
    if (body.settings) {
      if (!user.settings) {
        user.settings = {};
      }

      if (body.settings.timezone) {
        const validTimezones = [
          "UTC",
          "GMT",
          "EST",
          "CST",
          "MST",
          "PST",
          "IST",
          "JST",
          "AEST",
        ];
        if (!validTimezones.includes(body.settings.timezone)) {
          return createErrorResponse("Invalid timezone", 400);
        }
        user.settings.timezone = body.settings.timezone;
      }

      if (body.settings.theme) {
        const validThemes = ["light", "dark", "system"];
        if (!validThemes.includes(body.settings.theme)) {
          return createErrorResponse("Invalid theme", 400);
        }
        user.settings.theme = body.settings.theme;
      }

      if (body.settings.dateFormat) {
        const validFormats = [
          "YYYY-MM-DD",
          "MM/DD/YYYY",
          "DD/MM/YYYY",
          "DD-MMM-YYYY",
        ];
        if (!validFormats.includes(body.settings.dateFormat)) {
          return createErrorResponse("Invalid date format", 400);
        }
        user.settings.dateFormat = body.settings.dateFormat;
      }
    }

    // Save user
    user.updatedAt = new Date();
    await user.save();

    // Return updated user (without sensitive data)
    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        settings: user.settings,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    if (error instanceof ApiError) {
      return createErrorResponse((error as ApiError).message, (error as ApiError).statusCode);
    }
    return createErrorResponse("Internal server error", 500);
  }
}
