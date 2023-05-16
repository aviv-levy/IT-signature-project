const jwt = require("jsonwebtoken");


function verifyToken(req, res, next) {
    if (!req.headers.cookie) {
        console.log('not auth');
        return res.status(401).redirect('/login')
    }


    const token = req.headers.cookie.split("token=")[1];
    if (!token) {
        return res.redirect('/login').status(401).redirect('/login')
    }


    jwt.verify(token, process.env.SECRET_TOKEN, (err, payload) => {

        if (err && err.message === "jwt expired") {
            return res.status(403).redirect('/login')
        }

        if (err) {
            return res.status(401).send("You are not authorized to access this resource.");
        }

        req.permission = payload.permission;
        next();
    });


}

module.exports = verifyToken;