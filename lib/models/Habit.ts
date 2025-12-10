import { Schema, model, models, Types } from "mongoose";

const HabitSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },

    name: { type: String, required: true, trim: true, maxlength: 80 },

    description: { type: String, trim: true, maxlength: 300 },

    frequency: {
      type: String,
      enum: ["daily", "weekly", "custom"],
      required: [true, 'Frequency is required']
    },

    days: {
      type: [String],
      required: [true, 'Days is required'],
      validate: {
        validator: function(value: string[]) {
          return value && value.length > 0;
        },
        message: 'Days cannot be empty'
      }
    },

    time: {
      type: String,
      required: [true, 'Time is required'],
    },


    archived: { type: Boolean, default: false },

  },
  { versionKey: false, timestamps: true },
);

export default models.Habit || model("Habit", HabitSchema);
