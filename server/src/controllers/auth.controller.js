import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js'
import { TOKEN_SECRET_KEY } from '../config.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    const { email, username, password } = req.body
    try {
        const userFound = await User.findOne({ email })
        if (userFound) return res.status(400).json({ message: ['A user with this email already exists'] })
        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = new User({
            email,
            username,
            password: passwordHash
        });
        const userSaved = await newUser.save();
        const userData = {
            id: userSaved._id,
            username: userSaved.username,
            password: userSaved.password,
            createAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        }
        const token = await createAccessToken({ id: userSaved._id });
        res.cookie('token', token)
        res.json({
            menssage: 'User created successfully',
            data: userData
        })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const userFound = await User.findOne({ email })
        if (!userFound) return res.status(400).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(password, userFound.password)
        if (!isMatch) return res.status(400).json({ message: 'User or Password incorrect' });
        const token = await createAccessToken({ id: userFound._id });
        res.cookie('token', token)
        res.json({
            menssage: 'User logged in successfully',
        })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
export const logout = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
    });
    return res.sendStatus(200);
};
export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id)
    if (!userFound) return res.status(400).json({ message: 'User not found' })
    return res.json({
        id: userFound._id,
        email: userFound.email,
        username: userFound.username,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt
    })
}
export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.send(false);

    jwt.verify(token, TOKEN_SECRET_KEY, async (error, user) => {
        if (error) return res.sendStatus(401);

        const userFound = await User.findById(user.id);
        if (!userFound) return res.sendStatus(401);

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
        });
    });
};