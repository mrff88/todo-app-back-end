import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//Controller to get all Users.
export const getAllUsers = async (request, response) => {
  try {
    const users = await User.find();
    if (users.length === 0) response.status(204).send();
    else response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ error });
  }
};

//Controller to create a user
export const createUser = async (request, response) => {
  const { password, email } = request.body;

  const passToHash = `${password}${email}`;

  const hash = await bcrypt.hash(passToHash, 10);

  const newUser = new User({ ...request.body, password: hash });

  try {
    const user = await newUser.save();
    response.status(201).json(user);
  } catch (error) {
    response.status(500).send(error);
  }
};

//Controller to login a user
export const login = async (request, response) => {
  const { email, password } = request.body;

  const user = await User.find({ email });
  const userDB = user[0];

  console.log(userDB);
  if (userDB.length === 0) response.status(403).send();

  //Validate hash
  const passToHash = `${password}${userDB.email}`;

  bcrypt.compare(passToHash, userDB.password, (err, isPassValid) => {
    if (email === userDB.email && isPassValid) {
      // JWT
      jwt.sign(
        { id: userDB._id, email: userDB.email },
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
    } else {
      response.status(403).send();
    }
  });
};
