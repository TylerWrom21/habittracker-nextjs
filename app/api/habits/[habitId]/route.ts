// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db/mongodb";
// import Habit from "@/lib/models/Habit";
// import { verifyToken } from "@/lib/auth/jwt";

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     const cookieHeader = req.headers.get("cookie");
//     if (!cookieHeader) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const token = cookieHeader.split("token=")[1];
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = verifyToken(token);

//     const updated = await Habit.findOneAndUpdate(
//       { _id: params.id, userId: userId },
//       body,
//       { new: true }
//     );

//     if (!updated) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }

//     return NextResponse.json({ habit: updated });
//   } catch (err) {
//     console.error("PATCH /api/habits/[id] error:", err);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();

//     const cookieHeader = req.headers.get("cookie");
//     if (!cookieHeader) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const token = cookieHeader.split("token=")[1];
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = verifyToken(token);

//     const deleted = await Habit.findOneAndDelete({
//       _id: params.id,
//       userId: userId,
//     });

//     if (!deleted) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("DELETE /api/habits/[id] error:", err);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
