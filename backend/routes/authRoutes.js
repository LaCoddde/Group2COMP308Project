const express = require("express");
const router = express.Router();
const { createToken } = require("../utils/auth");
const User = require("../models/User");

router.post("/login", async (req, res) => {
  try {
      const {email, password} = req.body
      const user = await User.login(email, password);
      const token = createToken(user._id)
      res.cookie('jwt', token, {httpOnly: true, maxAge: 3*24*60*60*1000})
      res.status(201).json({token, id: user._id, roleId: user.roleId, email: user.email,  name: user.name, age: user.age,  gender: user.gender});
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  try{
      const {email, password,roleId, name, gender, age} = req.body
      const user = await User.create({email, password, roleId, name, gender, age})
      const token = createToken(user._id)
      res.cookie('jwt', token, {httpOnly: true, maxAge: 3*24*60*60*1000})
      res.status(201).json({token, id: user._id, roleId: user.roleId, email: user.email,  name: user.name, age: user.age,  gender: user.gender});
  }catch(error) {
      res.status(400).json({
          message: error.message
      })
  }
});

module.exports = router;
