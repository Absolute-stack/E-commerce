import jwt from 'jsonwebtoken';

async function userAuth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({
        success: false,
        message: 'Please Login Or Try Again later',
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}

export default userAuth;
