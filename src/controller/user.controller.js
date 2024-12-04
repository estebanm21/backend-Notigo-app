const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const User = require('../model/user.model');

// FUNCION PARA TRAER A UN USUARIO POR EL ID
const findOneUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  return res.status(200).json({
    status: 'success',

    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// FUNCION PARA TRAER TODOS LOS USUARIOS ACTIVOS
const findAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      status: 'active',
      role: 'user',
    },
  });

  return res.status(200).json({
    status: 'success',
    users,
  });
});

//FUNCION PARA ACTUALIZAR LOS DATOS DE UN USUARIO
const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req; // Usuario encontrado en el middleware
  const userId = req.sessionUser.id; // ID del usuario en sesión
  const { name } = req.body;

  // Verificar que el ID del usuario en sesión coincida con el ID del usuario que se está actualizando
  if (user.id !== userId) {
    return next(
      new AppError('You do not have permission to perform this action', 401)
    );
  }

  // Actualizar el nombre
  if (name) {
    user.update({
      name,
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
  });
});

// FUNCION PARA DESABILITAR UN USUARIO
const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  user.update({ status: 'inactive' });

  return res.status(200).json({
    status: 'success',
    message: 'user deleted successfully!',
  });
});

// FUNCION QUE TRAE TODOS LOS DATOS DEL USUARIO EN SESION
const findSessionUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req; // Usuario encontrado en el middleware

  // Verificar si hay un usuario en sesión
  if (!sessionUser) {
    return next(new AppError('No session user found', 404));
  }

  return res.status(200).json({
    status: 'success',
    sessionUser,
  });
});

module.exports = {
  findOneUser,
  findAllUsers,
  deleteUser,
  updateUser,
  findSessionUser,
};
