const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const Store = require('../model/store.model');

const validStore = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const store = await Store.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!store) {
    return next(new AppError(`store with id ${id} not found`, 404));
  }

  req.store = store;
  next();
});

module.exports = {
  validStore,
};
