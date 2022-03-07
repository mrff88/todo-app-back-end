import express from 'express';
import { taskCtrl } from '../controllers/index.js';

const { getAllTasks, createTask, updateTask, deleteTask } = taskCtrl;

const router = express.Router();

const taskRoutes = {
  GET_ALL: '/tasks',
  CREATE: '/tasks/create',
  UPDATE: '/tasks/update/:id',
  DELETE: '/tasks/delete/:id',
};

router.get(taskRoutes.GET_ALL, getAllTasks);
router.post(taskRoutes.CREATE, createTask);
router.put(taskRoutes.UPDATE, updateTask);
router.delete(taskRoutes.DELETE, deleteTask);

export default router;
