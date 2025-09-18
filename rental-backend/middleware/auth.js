const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc    Protect routes by verifying JWT token
 */
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user to the request object
        req.user = await User.findById(decoded.id);
        
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

/**
 * @desc    Grant access to specific roles
 * @param   {...String} roles - List of roles that are allowed
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role '${req.user.role}' is not authorized to access this route` 
            });
        }
        next();
    };
};

