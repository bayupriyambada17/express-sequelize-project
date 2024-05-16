const { users } = require('../models')
const { hashPassword, comparePassword } = require('../config/bcrypt')
const generateToken = require('../config/generateToken');
const { successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  internalErrorResponse
} = require('../config/responseJson')

// membuat sebuah register controller
async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    // cek email sudah ada atau belum?
    // jika sudah ada maka tidak boleh terisi kembali.
    const existingEmail = await users.findOne({
      where: { email }
    });
    if (existingEmail) errorResponse(res, 'Email already exists', 400);
    // jika belum ada, maka di buat
    const hashedPassword = await hashPassword(password);
    // insert into users (username, email, password) values(?, ?, ?)
    const user = await users.create({
      username,
      email,
      password: hashedPassword
    });
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    successResponse(res, 'Register successfully', userResponse);
  } catch (error) {
    console.error(error);
    internalErrorResponse(res, error);
  }
}