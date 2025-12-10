import { Schema, model, models, Types } from "mongoose";

const HabitEntrySchema = new Schema(
  {
    habitId: { type: Types.ObjectId, ref: "Habit", required: true, index: true },

    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },

    date: {
      type: String,
      required: true,
      index: true,
    },

    count: {
      type: Number,
      default: 1,
      min: 1,
      max: 50,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { versionKey: false }
);

HabitEntrySchema.index({ habitId: 1, date: 1 }, { unique: true });

export default models.HabitEntry || model("HabitEntry", HabitEntrySchema);
