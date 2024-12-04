require('dotenv').config();
const { app } = require('./app');

const { db } = require('./database/config');
const { initModel } = require('./model/initModel');
// comentario
initModel();

db.authenticate()
  .then(() => console.log('database conected...'))
  .catch((err) => console.log(err));

db.sync({ force: false })
  .then(() => console.log('database sincorized'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
