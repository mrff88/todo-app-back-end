import { User, Token } from '../models/index.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import emailSender from '../services/emailSender.js';

// Controller to get all Users.
export const getAllUsers = async (request, response) => {
  try {
    const users = await User.find();
    if (users.length === 0) response.status(204).send();
    else response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ error });
  }
};

// Controller to create a user
export const createUser = async (request, response) => {
  const { password, email } = request.body;

  const userExist = await User.findOne({ email: email });
  if (userExist)
    return response
      .status(409)
      .send({ message: 'A user with given email already Exist!' });

  const passToHash = `${password}${email}`;

  const hash = await bcrypt.hash(passToHash, 10);

  const newUser = new User({ ...request.body, password: hash });

  try {
    const user = await newUser.save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    }).save();

    const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;

    // Send email
    emailSender.config = {
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.SECURE,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    };
    await emailSender.sendMail({
      from: process.env.SENDER_EMAIL_ADDRESS,
      to: user.email,
      subject: 'Verify your account',
      text: `Please, verify your account with the following link: ${url}`,
    });

    response.status(201).json(user);
  } catch (error) {
    response.status(500).send(error);
  }
};

// Controller to verify user
export const verify = async (request, response) => {
  const { id, token } = request.body;

  try {
    const userFound = await User.findOne({ _id: id });
    if (!userFound)
      return response.status(400).send({ message: 'Invalid link' });

    const tokenFound = await Token.findOne({
      userId: userFound._id,
      token: token,
    });
    if (!tokenFound)
      return response.status(400).send({ message: 'Invalid link' });

    await User.updateOne({ _id: userFound._id }, { verified: true });
    await token.remove();

    response.status(200).send({ message: 'Email verified successfully' });
  } catch (error) {
    response.status(500).send({ message: 'Internal server error' });
  }
};

// Controller to login a user
export const login = async (request, response) => {
  const { email, password } = request.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return response
        .status(401)
        .send({ message: 'Invalid Email or password' });

    //Validate hash
    const passToHash = `${password}${userFound.email}`;
    const validPassword = bcrypt.compare(passToHash, userFound.password);
    if (!validPassword)
      return response
        .status(401)
        .send({ message: 'Invalid Email or password' });

    if (!userFound.verified) {
      const tokenFound = await Token.findOne({ userId: userFound._id });
      if (!tokenFound) {
        const newToken = await new Token({
          userId: userFound._id,
          token: crypto.randomBytes(32).toString('hex'),
        }).save();
        const url = `${process.env.BASE_URL}users/${userFound._id}/verify/${newToken.token}`;

        // Send email
        emailSender.config = {
          host: process.env.HOST,
          port: process.env.EMAIL_PORT,
          secure: process.env.SECURE,
          auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY,
          },
        };
        await emailSender.sendMail({
          from: process.env.SENDER_EMAIL_ADDRESS,
          to: userFound.email,
          subject: 'Verify your account',
          text: `Please, verify your account with the following link: ${url}`,
        });
      }
      return res
        .status(400)
        .send({ message: 'An Email sent to your account please verify' });
    }
    // JWT
    jwt.sign(
      { id: userFound._id, email: userFound.email },
      process.env.SECRET_KEY,
      (error, token) => {
        if (!error) {
          response.status(200).json({
            token,
          });
        } else {
          response.status(403).send();
        }
      }
    );
  } catch (error) {
    response.status(500).send({ message: 'Internal server error' });
  }
};
