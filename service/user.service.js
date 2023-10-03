const userModel = require('../model/user.model')
const { HashPassword } = require('../helper/util')

// OK
const getAll = async () => {

    const data = await userModel
        .find({})
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const getAllByUsernames = async (usernames) => {

    const data = await userModel
        .find({ username: { $in: usernames } })
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const getByUsername = async (username) => {

    const data = await userModel
        .find({ username: username })
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const createMany = async (usersData) => {

    const result = []

    for (let userData of usersData) {
        const { username, first_name, last_name, password } = userData

        if (!username || !first_name || !last_name || !password) return ({ status: 400, err: { message: "bad params" } })

        const hashedPassword = await HashPassword(userData.password)

        const data = await userModel
            .create({ ...userData, password: hashedPassword })
            .catch(err => ({ status: 500, err }))

        result.push(data)
    }
    return result
}

// OK
const updateByUsername = async (username, userData) => {

    const data = await userModel
        .updateOne({ username: username }, { ...userData })
        .catch(err => ({ status: 500, err }))

    return data
}

// OK
const deleteByUsername = async (username) => {

    const data = await userModel
        .deleteOne({ username: username })
        .catch(err => ({ status: 500, err }))

    return data
}

module.exports = {
    getAll,
    getAllByUsernames,
    getByUsername,
    createMany,
    updateByUsername,
    deleteByUsername
}