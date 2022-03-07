import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
  title: String,
  isComplete: Boolean,
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

const Task = mongoose.model('Tasks', taskSchema, 'tasks');

export default Task;
