const { tb_messages, tb_users, sequelize } = require('../../models')
const joi = require('joi'); //package validation data

exports.addMessage = async (req, res) => {
    try {
        const idReceiver = req.params.id_user_send_to
        const idSender = req.user.id
        const data = req.body

        const schema = joi.object({
            message: joi.string().required(),
        });

        // do validation and get error
        const { error } = schema.validate(data);

        // if error exixst send validation error message}
        if (error) {
            return res.status(400).send({
                error: error.details[0].message
            })
        }
        const insertData = await tb_messages.create({
            idSender,
            idReceiver,
            message: data.message
        })

        const Message = await tb_messages.findOne({
            where: {
                id: insertData.id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idSender', 'idReceiver']
            },
            include: {
                model: tb_users,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'email', 'password', 'bio']
                },
            }
        })
        res.send({
            status: 'sucess',
            data: {
                Message,
            }

        })
    } catch (err) {
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}

exports.messages = async (req, res) => {
    try {
        const idSender = req.params.id_user_send_to
        const idReceiver = req.user.id

        if (idSender == idReceiver) {
            return res.status(400).send({
                status: 'failed',
                message: 'Bad reqeust'
            })
        }

        const Message = await tb_messages.findAll({
            where: {
                idSender: [idReceiver, idSender],
                idReceiver: [idReceiver, idSender]
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idSender', 'idReceiver']
            },
            include: {
                model: tb_users,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'email', 'password', 'bio']
                },
            }
        })

        res.send({
            status: 'success',
            data: {
                Message
            }
        })
    } catch (err) {
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}