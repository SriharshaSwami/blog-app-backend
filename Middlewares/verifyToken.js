import jwt from "jsonwebtoken"

export const verifyToken = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Read token from cookies (requires cookie-parser in server)
            const token = req.cookies?.token
            if (!token) {
                return res.status(401).json({ message: "Unauthorized req. Plz login first" })
            }

            // Verify and decode token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

            if (!allowedRoles.includes(decodedToken.role)) {
                return res.status(403).json({ message: "Forbidden, You don't have permission" })
            }

            // Attach user info to req for use in routes
            req.user = decodedToken
            next()
        } catch (err) {
            // jwt.verify throws if token is invalid
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Session expired. Please login again.' })
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token. Please login.' })
            }

            return res.status(500).json({ message: 'Token verification failed' })
        }
    }
}
