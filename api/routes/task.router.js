import express from 'express';
import { taskCtrl } from '../controllers/index.js';
import { validateToken } from '../middlewares/index.js';

const { getAllTasks, createTask, updateTask, deleteTask } = taskCtrl;

const router = express.Router();

const taskRoutes = {
  GET_ALL: '/tasks',
  CREATE: '/tasks/create',
  UPDATE: '/tasks/update/:id',
  DELETE: '/tasks/delete/:id',
};

router.get(taskRoutes.GET_ALL, validateToken, getAllTasks);
router.post(taskRoutes.CREATE, validateToken, createTask);
router.put(taskRoutes.UPDATE, validateToken, updateTask);
router.delete(taskRoutes.DELETE, validateToken, deleteTask);

export default router;
