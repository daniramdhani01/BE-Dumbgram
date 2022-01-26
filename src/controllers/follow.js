const { tb_users, tb_follows } = require("../../models"); //table db
const jwt = require('jsonwebtoken') //package token
// ==================
// following
// ==================
exports.following = async (req, res) => {
    try {
        const { id } = req.params
        let user = await tb_follows.findAll({
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
        res.send({
            status: 'failed',
            message: 'server error'
        })
    }
}