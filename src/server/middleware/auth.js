const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../services/userService')

exports.protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.Authorization &&
    req.headers.Authorization.startsWith('Bearer')
  ) {
    token = req.headers.Authorization.split(' ')[1]
  }
  // Set token from cookie
  // else if (req.cookies.token) {
  //   token = req.cookies.token
  // }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }

  try {
    // Verify token
    console.log(process.env)
    const decoded = jwt.verify(token, process.env.VUE_APP_JWT_SECRET)
    console.log('decode',decoded)
    //modification
    // req.user = await User.findById(decoded.id).populate('subscribers')
    req.user = await User.findById(decoded.id)
    req.user = await req.user.populate('subscribers')
    next()
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }
})

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      )
    }
    next()
  }
}
