const { tb_users } = require("../../models"); //table db
const joi = require('joi'); //package validation data
const bcrypt = require('bcrypt') //package encryption data
const jwt = require('jsonwebtoken') //package token

// register user
exports.register = async (req, res) => {
  const data = req.body;
  const schema = joi.object({
    email: joi.string().email().required(),
    username: joi.string().required(),
    password: joi.string().min(8).required(),
    fullName: joi.string().required(),
  });

  //do validation and get error
  const { error } = schema.validate(data);

  //if error exixst send validation error message}
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    })
  }

  try {
    const userExist = await tb_users.findOne({
      where: {
        email: data.email
      },
    })

    if (userExist) {
      return res.send({
        status: 'failed',
        message: 'user has been register'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)

    const newUser = await tb_users.create({
      ...data,
      password: hashedPassword
    });

    const dataToken = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      username: newUser.username,

    }
    const SECRET_KEY = 'BismillahTahunIniNikah'
    const token = jwt.sign(dataToken, SECRET_KEY)

    res.status(200).send({
      status: "success",
      data: {
        user: {
          fullName: newUser.fullName,
          username: newUser.username,
          token,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

// user login
exports.login = async (req, res) => {
  const data = req.body;
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  //do validation and get error
  const { error } = schema.validate(data);

  //if error exixst send validation error message}
  if (error) {
    return res.status(400).send({
      error: error.details[0].message
    })
  }

  try {
    const userExist = await tb_users.findOne({
      where: {
        email: data.email
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })

    if (!userExist) {
      return res.send({
        status: 'failed',
        message: 'Email not register'
      })
    }

    const isValid = await bcrypt.compare(data.password, userExist.password)

    if (isValid == false) {
      return res.send({
        status: 'failed',
        message: 'Email & password not match'
      })
    }

    const dataToken = {
      id: userExist.id,
      fullName: userExist.fullName,
      email: userExist.email,
      username: userExist.username,

    }
    const SECRET_KEY = 'BismillahTahunIniNikah'
    const token = jwt.sign(dataToken, SECRET_KEY)

    res.status(200).send({
      status: 'success',
      data: {
        user: {
          fullName: userExist.fullName,
          email: userExist.email,
          username: userExist.username,
          token,
        }
      }
    })
  } catch (err) {
    console.log(err);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};