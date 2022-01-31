const { tb_feeds, tb_users, tb_follows, tb_likes, tb_comments } = require("../../models"); //table db
const joi = require('joi'); //package validation data

exports.addImage = async (req, res) => {
    try {
        const data = req.body;

        const schema = joi.object({
            caption: joi.string(),
        });

        //do validation and get error
        const { error } = schema.validate(data);

        //if error exixst send validation error message}
        if (error) {
            return res.status(400).send({
                error: error.details[0].message
            })
        }

        const newFeed = await tb_feeds.create({
            ...data,
            filename: req.file.filename,
            idUser: req.user.id,
        });

        let feed = await tb_feeds.findOne({
            where: {
                id: newFeed.id
            },
            include: {
                model: tb_users,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', 'bio',]
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'like', 'idUser']
            }
        })

        // feed = JSON.parse(JSON.stringify(feed));

        // feed = {
        //     ...feed,
        //     image: process.env.PATH_FILE + feed.filename,
        // };

        res.send({
            status: 'success',
            feed,
        })
    }
    catch (err) {
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}

exports.feedFollowing = async (req, res) => {
    try {
        const { id } = req.user
        const data = await tb_follows.findAll({
            where: {
                idUser: id,
            },
            include: {
                model: tb_users,
                as: 'userFollowing',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', 'bio', 'email']
                },
                include: {
                    model: tb_feeds,
                    as: 'feeds',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'idUser']
                    },
                    include: {
                        model: tb_users,
                        as: 'user',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'password', 'bio', 'email']
                        },
                    },
                },
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'id', 'idUser', 'idFollowing']
            }
        })

        const newData = data.map((currentValue) => { return currentValue.userFollowing.feeds })

        let feed = []
        for (i = 0; i < newData.length; i++) {
            for (ix = 0; ix < newData[i].length; ix++) {
                feed.push(newData[i][ix])
            }
        }
        res.send({
            status: 'success',
            data: {
                feed
            }
        })
    } catch (error) {
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}

exports.Feeds = async (req, res) => {
    try {
        const feed = await tb_feeds.findAll({
            include: {
                model: tb_users,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', 'email', 'bio']
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idUser']
            }
        })

        res.send({
            status: 'success',
            data: {
                feed
            }
        })
    } catch (err) {
        res.status(500).send({
            status: 'failed',
            message: 'server failed'
        })
    }
}

exports.addLike = async (req, res) => {
    try {
        const idFeed = req.body.id
        const idUser = req.user.id

        //check like
        const likeExist = await tb_likes.count({
            where: {
                idUser,
                idFeed
            }
        })

        if (likeExist) {
            return res.status(400).send({
                status: 'failed',
                message: 'picture has been like'
            })
        }

        const feedExist = await tb_feeds.count({
            where: {
                id: idFeed
            }
        })

        if (!feedExist) {
            return res.status(404).send({
                status: 'failed',
                message: 'Data not found'
            })
        }

        await tb_likes.create({
            idUser,
            idFeed
        })

        const amountLikes = await tb_likes.count({
            where: {
                idFeed
            }
        })

        await tb_feeds.update({ like: amountLikes }, {
            where: {
                id: idFeed
            }
        })
        res.send({
            status: 'success',
            data: {
                feed: {
                    id: idFeed
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

exports.comments = async (req, res) => {
    try {
        const idFeed = req.params.id

        const comments = await tb_comments.findAll({
            where: {
                idFeed
            },
            attributes: {
                exclude: ['idUser', 'idFeed', 'createdAt', 'updatedAt']
            },
            include: {
                model: tb_users,
                as: 'user',
                attributes: {
                    exclude: ['bio', 'password', 'email', 'createdAt', 'updatedAt']
                }
            }
        })
        res.send({
            status: 'success',
            data: {
                comments
            }
        })
    } catch (err) {
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}