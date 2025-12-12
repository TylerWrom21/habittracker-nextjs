import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth/jwt";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db/mongodb";
import { getErrorResponse } from "@/lib/utils/error-handler";

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
    const body: UpdateProfileRequest = await request.json();

    // Validate and update name
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim().length === 0) {
        return NextResponse.json(
          getErrorResponse("Name must be a non-empty string"),
          { status: 400 }
        );
      }
      if (body.name.length > 60) {
        return NextResponse.json(
          getErrorResponse("Name must be 60 characters or less"),
          { status: 400 }
        );
      }
      user.name = body.name.trim();
    }

    // Validate and update email
    if (body.email !== undefined) {
      if (typeof body.email !== "string" || !body.email.includes("@")) {
        return NextResponse.json(
          getErrorResponse("Invalid email address"),
          { status: 400 }
        );
      }

      // Check if email already exists
      const existingUser = await User.findOne({
        email: body.email.toLowerCase(),
        _id: { $ne: decoded.userId },
      });

      if (existingUser) {
        return NextResponse.json(
          getErrorResponse("Email already in use"),
          { status: 400 }
        );
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
          return NextResponse.json(
            getErrorResponse("Invalid timezone"),
            { status: 400 }
          );
        }
        user.settings.timezone = body.settings.timezone;
      }

      if (body.settings.theme) {
        const validThemes = ["light", "dark", "system"];
        if (!validThemes.includes(body.settings.theme)) {
          return NextResponse.json(
            getErrorResponse("Invalid theme"),
            { status: 400 }
          );
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
          return NextResponse.json(
            getErrorResponse("Invalid date format"),
            { status: 400 }
          );
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
  } catch {
    return NextResponse.json(
      getErrorResponse("Internal server error"),
      { status: 500 }
    );
  }
}
