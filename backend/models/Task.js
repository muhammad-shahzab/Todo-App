const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
    maxlength: [200, "Task title cannot exceed 200 characters"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  category: {
    name: {
      type: String,
      default: "Personal",
      trim: true,
    },
    color: {
      type: String,
      default: "bg-blue-500",
      validate: {
        validator: (v) => /^bg-\w+-\d{3}$/.test(v),
        message: "Invalid color format. Use format like bg-blue-500",
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model("Task", taskSchema)
