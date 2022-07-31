const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if(authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_TOKEN, (err, payload) => {
            if(err) {
                return res.status(403).send('token is invalid');
            } else {
                req.user = payload;
                req.token = token;
                next();
            }
        })
    } else {
        res.status(401).send("you are not authenticated");
    }
}

module.exports = auth;