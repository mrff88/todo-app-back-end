import express from 'express';
import { userCtrl } from '../controllers/index.js';

const { getAllUsers, createUser, login, verify } = userCtrl;

const router = express.Router();

const userRoutes = {
  GET_ALL: '/users',
  CREATE: '/users/create',
  LOGIN: '/users/login',
  VERIFY: '/users/:id/verify/:token',
};

router.get(userRoutes.GET_ALL, getAllUsers);
router.post(userRoutes.CREATE, createUser);
router.post(userRoutes.LOGIN, login);
router.get(userRoutes.VERIFY, verify);

export default router;
