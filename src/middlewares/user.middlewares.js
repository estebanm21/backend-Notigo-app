const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const User = require('../model/user.model');

const validUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`user with id ${id} not found`, 404));
  }

  req.user = user;
  next();
});

module.exports = {
  validUser,
};
