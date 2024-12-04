const Store = require('../model/store.model');
const catchAsync = require('../helpers/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../helpers/jsonwebtoken');
const { storage } = require('../helpers/firebase');
const AppError = require('../helpers/AppError');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const signUpStore = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    address,
    locationRadius,
    latitude,
    longitude,
    categorie,
    description,
  } = req.body;

  // Verificar si la tienda ya está registrada
  const existingStore = await Store.findOne({ where: { email } });
  if (existingStore) {
    return next(new AppError('Email already in use', 400));
  }

  // Verificar si el archivo de imagen de perfil fue subido
  if (!req.file) {
    return next(new AppError('Please upload a profile image', 400));
  }

  // Cargar la imagen de perfil a Firebase Storage
  const imgRef = ref(storage, `stores/${Date.now()}-${req.file.originalname}`);
  const imgUpload = await uploadBytes(imgRef, req.file.buffer);

  // Encriptar la contraseña
  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  // Crear la tienda en la base de datos
  const store = await Store.create({
    name: name.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password: encryptedPassword,
    address,
    locationRadius,
    latitude,
    longitude,
    categorie,
    description,
    profileImgUrl: imgUpload.metadata.fullPath, // Ruta en Firebase Storage
    businessImgUrl: null, // Explicitamente null
  });

  // Generar el token de autenticación
  const token = await generateJWT(store.id);

  // Obtener la URL pública de la imagen de perfil
  const imgRefToDownload = ref(storage, store.profileImgUrl);
  const profileImgUrl = await getDownloadURL(imgRefToDownload);

  return res.status(200).json({
    status: 'success',
    message: 'Store created successfully',
    token,
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      categorie: store.categorie,
      profileImgUrl: profileImgUrl,
      businessImgUrl: null, // Devolvemos explícitamente null
      latitude: store.latitude,
      longitude: store.longitude,
    },
  });
});

// inicio de sesion de tienda
// inicio de sesion de tienda
const signInStore = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const store = await Store.findOne({
    where: {
      email: email.toLowerCase().trim(),
      status: 'active',
    },
  });

  if (!store) {
    return next(new AppError(`Store with email: ${email} not found`, 404));
  }

  if (!(await bcrypt.compare(password, store.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await generateJWT(store.id);

  // Obtener la URL pública de la imagen de perfil
  const profileImgRefToDownload = ref(storage, store.profileImgUrl);
  const profileImgUrl = await getDownloadURL(profileImgRefToDownload);

  // Si la tienda tiene una imagen de negocio, obtener la URL pública
  let businessImgUrl = null;
  if (store.businessImgUrl) {
    const businessImgRefToDownload = ref(storage, store.businessImgUrl);
    businessImgUrl = await getDownloadURL(businessImgRefToDownload);
  }

  return res.status(200).json({
    status: 'success',
    token,
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      categorie: store.categorie,
      description: store.description,
      latitude: store.latitude,
      longitude: store.longitud,
      locationRadius: store.locationRadius,
      profileImgUrl: profileImgUrl, // Devolvemos la URL pública de la imagen de perfil
      businessImgUrl: businessImgUrl, // Devolvemos la URL pública de la imagen del negocio (puede ser null)
    },
  });
});

module.exports = {
  signUpStore,
  signInStore,
};
