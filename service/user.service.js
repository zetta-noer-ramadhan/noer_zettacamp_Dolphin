const userModel = require('../model/user.model');
const { HashPassword } = require('../helper/util');

const GetAll = async (filter) => {
    filter = filter && Object.keys(filter).length > 0 ? filter : {};
    return await userModel.find(filter).catch((err) => ({ status: 500, err }));
};

const GetAllByUsernames = async (usernames) => {
    return await userModel.find({ username: { $in: usernames } }).catch((err) => ({ status: 500, err }));
};

const GetByUsername = async (username) => {
    return await userModel.find({ username: username }).catch((err) => ({ status: 500, err }));
};

const CreateMany = async (usersData) => {
    if (!usersData || typeof usersData !== 'object' || usersData.length) {
        return { status: 400, message: 'bad params' };
    }

    return usersData.map(async (userData) => {
        const { username, first_name, last_name, password } = userData;
        if (!username || !first_name || !last_name || !password) {
            return { status: 400, err: { message: 'bad params' } };
        }

        const hashedPassword = await HashPassword(userData.password);
        if (!hashedPassword) {
            return { status: 500, message: 'something wrong with password hashing' };
        }

        return await userModel.create({ ...userData, password: hashedPassword }).catch((err) => ({ status: 500, err }));
    });
};

module.exports = {
    GetAll,
    GetAllByUsernames,
    GetByUsername,
    CreateMany,
};
