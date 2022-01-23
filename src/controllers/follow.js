const { tb_users, tb_following, tb_follower } = require("../../models"); //table db
const jwt = require('jsonwebtoken') //package token
// ==================
// following
// ==================
exports.following = async (req, res) => {
    try {
        const { id } = req.params
        let user = await tb_following.findAll({
            where: {
                idUser: id,
            },
            include: {
                model: tb_users,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', 'bio', 'email']
                }

            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'id', 'idFollowing']
            }
        })

        res.send({
            status: 'success',
            data: {
                following: user
                // user: user[0]

            }
        })
    } catch (error) {
        res.send({
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
        let user = await tb_follower.findAll({
            where: {
                idUser: id,
            },
            include: {
                model: tb_users,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', 'bio', 'email']
                }

            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'id', 'idFollower']
            }
        })

        res.send({
            status: 'success',
            data: {
                follower: user
                // user: user[0]

            }
        })
    } catch (error) {
        res.send({
            status: 'failed',
            message: 'server error'
        })
    }
}