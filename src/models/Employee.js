import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  age: Number,
  class: String,
  subjects: [String],
  attendance: Number,
});

export default mongoose.model("Employee", employeeSchema);
