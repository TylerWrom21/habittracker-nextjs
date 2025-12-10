import { Schema, model, models, Types } from "mongoose";

const ReminderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },

    habitId: { type: Types.ObjectId, ref: "Habit", required: true },

    time: { type: String, required: true },

    enabled: { type: Boolean, default: true },

    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default models.Reminder || model("Reminder", ReminderSchema);
