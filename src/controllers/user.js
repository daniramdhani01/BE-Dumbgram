const { tb_users, tb_follows } = require("../../models"); //table db
const joi = require('joi'); //package validation data
const bcrypt = require('bcrypt') //package encryption data
const jwt = require('jsonwebtoken') //package token

// ==================
// register user
// ==================
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
    const SECRET_KEY = process.env.TOKEN_KEY
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
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

// ==================
// user login
// ==================
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
    const SECRET_KEY = process.env.TOKEN_KEY
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
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

// ==================
// show all user
// ==================
exports.showUsers = async (req, res) => {
  try {
    const data = await tb_users.findAll({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    })

    if (data == '') {
      return res.send({
        message: 'no data found'
      })
    }

    res.send({
      status: 'success',
      data: {
        users: {
          data,
        }
      }
    })
  } catch (err) {
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}
// ==================
// edit user
// ==================
exports.editUser = async (req, res) => {
  try {
    const id = req.params.id
    const newData = req.body

    await tb_users.update(newData, {
      where: {
        id
      }
    })

    const data = await tb_users.findOne({
      where: {
        id
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    })

    res.send({
      status: 'success',
      data: {
        user: {
          data
        }
      }
    })
  } catch (err) {
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

// ==================
// Delete User
// ==================
exports.deleteUser = async (req, res,) => {
  try {
    const { id } = req.params

    await tb_users.destroy({
      where: {
        id
      }
    })

    res.send({
      status: 'success',
      data: {
        id
      }
    })
  } catch (error) {
    res.status(500).send({
      status: 'failred',
      message: 'server error'
    })
  }
}

// ==================
// following
// ==================
exports.following = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await tb_follows.findAll({
      where: {
        idUser: id,
      },
      include: {
        model: tb_users,
        as: 'userFollowing',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password', 'bio', 'email']
        }

      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser', 'idFollowing']
      }
    })

    res.send({
      status: 'success',
      data: {
        following: user
      }
    })
  } catch (error) {
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

// ==================
// follower
// ==================
exports.follower = async (req, res) => {
  try {
    const { id } = req.params
    let user = await tb_follows.findAll({
      where: {
        idFollowing: id,
      },
      include: {
        model: tb_users,
        as: 'userFollower',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password', 'bio', 'email']
        }

      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser', 'idFollowing']
      }
    })

    res.send({
      status: 'success',
      data: {
        follower: user
      }
    })
  } catch (error) {
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.addFollow = async (req, res) => {
  try {
    const idFollowing = req.params.id
    const idUser = req.user.id

    if (idFollowing == idUser) {
      return res.status(400).send({
        status: 'failed',
        message: 'Bad request'
      })
    }

    const exist = await tb_follows.findAll({
      where: {
        idUser,
        idFollowing
      }
    })

    if (exist) {
      return res.status(400).send({
        status: 'failed',
        message: 'account has been follow'
      })
    }

    const follow = await tb_follows.create({
      idFollowing,
      idUser
    })

    res.send({
      status: 'sucess',
      following: follow.idFollowing
    })

  } catch (err) {
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.unfollow = async (req, res) => {
  try {
    const idFollowing = req.params.id
    const idUser = req.user.id

    const exist = await tb_follows.findOne({
      where: {
        idUser,
        idFollowing
      }
    })

    if (!exist) {
      return res.status(400).send({
        status: 'failed',
        message: 'bad request'
      })
    }

    await tb_follows.destroy({
      where: {
        id: exist.id
      }
    })

    res.send({
      status: 'success',
      data: {
        unfollow: exist.idFollowing
      }
    })
  } catch (err) {
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}