import { Schema, model, models, Types } from "mongoose";

const StreakSchema = new Schema(
  {
    habitId: { type: Types.ObjectId, ref: "Habit", required: true, index: true },

    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },

    currentStreak: { type: Number, default: 0, min: 0 },
    longestStreak: { type: Number, default: 0, min: 0 },

    lastCompleted: { type: String },

    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default models.Streak || model("Streak", StreakSchema);
