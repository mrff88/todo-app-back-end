import { Task } from '../models/index.js';

//Controller to get all Tasks
export const getAllTasks = async (request, response) => {
  try {
    const tasks = await Task.find();
    if (tasks.length === 0) response.status(204).send();
    else response.status(200).json(tasks);
  } catch (error) {
    response.status(500).json({ error });
  }
};

//Controller to Create a task
export const createTask = async (request, response) => {
  const task = new Task(request.body);
  try {
    const newTask = await task.save();
    newTask && response.status(201).json(newTask);
  } catch (error) {
    response.status(500).json({ error });
  }
};
//Controller to update a task
export const updateTask = async (request, response) => {
  const taskValueToUpdate = request.body;
  const { id: idTask } = request.params;
  try {
    const task = await Task.findById(idTask);
    taskValueToUpdate.updatedAt = new Date();
    Task.updateOne(task, taskValueToUpdate, (error, updatedTask) => {
      !error
        ? response.status(200).json(updatedTask)
        : response.status(500).send(error);
    });
  } catch (error) {
    response.status(500).send(error);
  }
};

//Controller to delete a task
export const deleteTask = async (request, response) => {
  const { id: idTask } = request.params;
  try {
    const taskToDelete = await Task.findById(idTask);
    if (!taskToDelete)
      response.status(204).send({ error: 'No task to delete' });
    else {
      const deletedTask = await Task.deleteOne(taskToDelete);
      if (deletedTask) response.status(200).json(deletedTask);
    }
  } catch (error) {
    response.status(500).json({ error });
  }
};
