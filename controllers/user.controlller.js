import User from '../mongodb/models/user.js';

const getAllUsers = async (req, res) => {
    try {
        const user = await User.find({}).limit(req.query._end);
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const createUser = async (req, res) => {

    try {
        const { name, email, avatar } = req.body;
        const userExist = await User.findOne({ email });

        if (userExist) return res.status(200).json(userExist);
        
        const newUser = await User.create({
            name,
            email,
            avatar
        });

        res.status(200).json(newUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserInfoById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id }).populate('allProperties');

        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(200).json({ 'Message': 'User Not Found' });
        }
    } catch (error) {
        res.send(500).json({ message: error });
    }
};

export {
    getAllUsers,
    createUser,
    getUserInfoById
}