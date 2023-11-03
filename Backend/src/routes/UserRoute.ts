import express from 'express';
import { body, check, validationResult } from 'express-validator';
import { UserService } from '../services/UserService';
import {upload} from '../utils/FileUpload'
const UserRouter = express.Router();
const userService = new UserService();

UserRouter.post('/register', upload.single('profilePicture'), async (req, res) => {
    
    try {
        console.log(req.body)
        if (req.file) {
            console.log(req.file.filename)
            req.body.profilePicture = `/uploads/${req.file.filename}`;
            console.log(req.body)
          }
      const newUser = await userService.registerUser(req.body);
      return res.status(201).json(newUser);
    } catch (error) {
      if (error.message === 'User already exists') {
        return res.status(409).json({ "Error": 'User already exists' });
      } else {
        return res.status(500).json({ "Error": 'Registration failed' });
      }
    }
  });
  
  export default UserRouter;