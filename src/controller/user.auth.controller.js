const User = require('../model/user.model');
const catchAsync = require('../helpers/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../helpers/jsonwebtoken');
const AppError = require('../helpers/AppError');

// FUNCION DE REGISTRO PARA USUARIOS
const signUp = catchAsync(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // Si el correo ya existe, se lanza un error de usuario duplicado
      return next(new AppError('Email already in use', 400)); // Usa `next` para pasar el error al middleware
    }

    const salt = await bcrypt.genSalt(12);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: encryptedPassword,
    });

    const token = await generateJWT(user.id);

    return res.status(200).json({
      status: 'success',
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error); // Pasa el error al middleware global
  }
});

// FUNCION DE INICIO DE SESION PARA USUARIOS
const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`user with email:${email} not found`, 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await generateJWT(user.id);

  return res.status(200).json({
    status: 'success',

    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// FUNCION PARA CAMBIAR LA CONTASEÑA DEL USUARIO

const updatePassword = catchAsync(async (req, res, next) => {
  //1. traerme el usuario que viene de la req, del midleware
  const { user } = req;

  //2. traerme los datos de la req.body
  const { currentPassword, newPassword } = req.body;

  //3. validar si la contraseña actual y nueva son iguales enviar un error
  if (currentPassword === newPassword) {
    return next(new AppError('The password cannot be equals', 400));
  }

  //4. validar si la contraseña actual es igual a la contraseña en bd
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  //5. encriptar la nueva contraseña
  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(newPassword, salt);

  //6. actualizar el usuario que viene de la req
  await user.update({
    password: encryptedPassword,
    passwordChangeAt: new Date(),
  });

  //7. enviar el mensaje al cliente
  return res.status(200).json({
    status: 'success',
    message: 'The user password was updated successfully',
  });
});

module.exports = {
  signUp,
  signIn,
  updatePassword,
};
