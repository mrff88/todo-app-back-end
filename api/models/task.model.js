import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title: String,
    isComplete: Boolean,
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Tasks', taskSchema, 'tasks');

export default Task;
