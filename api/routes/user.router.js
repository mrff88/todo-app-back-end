import express from 'express';
import { userCtrl } from '../controllers/index.js';

const {
  getAllUsers,
  createUser,
  login,
  verify,
  sendPasswordChangeLink,
  verifyPasswordChangeLink,
  changeUserPassword,
} = userCtrl;

const router = express.Router();

const userRoutes = {
  GET_ALL: '/users',
  CREATE: '/users/create',
  LOGIN: '/users/login',
  VERIFY: '/users/:id/verify/:token',
  SEND_PASSWORD_CHANGE_LINK: '/users/password-reset',
  VERIFY_PASSWORD_CHANGE_LINK: '/users/verify-password-reset/:id/:token',
  CHANGE_PASSWORD: '/users/change-password/:id/:token',
};

router.get(userRoutes.GET_ALL, getAllUsers);
router.post(userRoutes.CREATE, createUser);
router.post(userRoutes.LOGIN, login);
router.get(userRoutes.VERIFY, verify);
router.post(userRoutes.SEND_PASSWORD_CHANGE_LINK, sendPasswordChangeLink);
router.get(userRoutes.VERIFY_PASSWORD_CHANGE_LINK, verifyPasswordChangeLink);
router.post(userRoutes.CHANGE_PASSWORD, changeUserPassword);

export default router;
