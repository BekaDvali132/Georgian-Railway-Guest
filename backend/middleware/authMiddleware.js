const jwt = require('jsonwebtoken');
const pool = require('../database/db')

const protect = async (req,res,next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await pool.query(`SELECT * FROM users WHERE id = $1`,[decoded.id]);

            req.user = req.user?.rows?.[0]

            next()
        } catch (error) {
            console.log(error);
            res.status(401).json({message:'Not authorized, invalid token'})
        }

        if (!token) {
            res.status(401).json({message:'Not authorized, no token'})
        }
    } else {
        res.status(401).json({message:'Not authorized, no token'})
    }
}

const protectUser = async (req,res,next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get client from the token
            let physicalCustomer = await pool.query(`SELECT * FROM physical_customers WHERE id = $1`,[decoded.id]);
            let legalCustomer = await pool.query(`SELECT * FROM legal_customer WHERE id = $1`,[decoded.id]);

            if (physicalCustomer?.rows?.[0]) {
                req.user = physicalCustomer.rows[0]
            } else {
                req.user = legalCustomer?.rows?.[0]
            }

            next()
        } catch (error) {
            console.log(error);
            res.status(401).json({message:'Not authorized, invalid token'})
        }

        if (!token) {
            res.status(401).json({message:'Not authorized, no token'})
        }
    } else {
        res.status(401).json({message:'Not authorized, no token'})
    }
}

module.exports = {protect,protectUser}