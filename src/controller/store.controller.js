const { getDownloadURL, ref, uploadBytes } = require('firebase/storage');
const catchAsync = require('../helpers/catchAsync');
const Store = require('../model/store.model');
const { storage } = require('../helpers/firebase');
const AppError = require('../helpers/AppError');

// FUNCION PARA LISTAR TODAS LAS TIENDAS
const findAllStores = catchAsync(async (req, res, next) => {
  const stores = await Store.findAll({
    where: {
      status: 'active',
    },
  });

  const storesPromise = stores.map(async (store) => {
    const imgRef = ref(storage, store.profileImgUrl);
    const url = await getDownloadURL(imgRef);
    store.profileImgUrl = url;
    return store;
  });

  const storeResolved = await Promise.all(storesPromise);

  return res.status(200).json({
    status: 'success',
    setores: storeResolved,
  });
});

// FUNCION PARA BUSCAR UNA TIENDA POR EL ID
const findOneStore = catchAsync(async (req, res, next) => {
  const { store } = req;

  // Obtener la URL de la imagen del perfil
  const profileImgRef = ref(storage, store.profileImgUrl);
  const profileImgUrl = await getDownloadURL(profileImgRef);

  // Obtener la URL de la imagen del negocio
  const businessImgRef = ref(storage, store.businessImgUrl);
  const businessImgUrl = await getDownloadURL(businessImgRef);

  return res.status(200).json({
    status: 'success',
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      longitude: store.longitude,
      latitude: store.latitude,
      description: store.description,
      profileImgUrl: profileImgUrl, // URL de la imagen del perfil
      businessImgUrl: businessImgUrl, // URL de la imagen del negocio
      categorie: store.categorie,
    },
  });
});

// FUNCION PARA QUE UNA TIENDA PUEDA ACTUALIZAR SUS DATOS
const updateStore = catchAsync(async (req, res, next) => {
  const { store } = req; // Tienda encontrada en el middleware
  const storeId = req.sessionStore.id; // ID de la tienda en sesión
  const {
    name,

    address,
    locationRadius,
    latitude,
    longitude,
    categorie,
    description,
  } = req.body;

  if (store.id !== storeId) {
    return next(
      new AppError('You do not have permission to perform this action', 401)
    );
  }

  // Actualizar solo los campos que están en el cuerpo de la solicitud
  const updatedFields = {};
  if (name) updatedFields.name = name;

  if (address) updatedFields.address = address;
  if (locationRadius) updatedFields.locationRadius = locationRadius;
  if (latitude) updatedFields.latitude = latitude;
  if (longitude) updatedFields.longitude = longitude;
  if (categorie) updatedFields.categorie = categorie;
  if (description) updatedFields.description = description;

  await store.update(updatedFields); // Guarda los cambios

  return res.status(200).json({
    store,
    status: 'success',
    message: 'Store updated successfully',
  });
});

// FUNCION PARA QUE EL ADMIN PUEDA DESABILITAR UNA TIENDA
const deleteStore = catchAsync(async (req, res, next) => {
  const { store } = req;

  store.update({ status: 'inactive' });
  return res.status(200).json({
    status: 'success',
    message: 'store deleted successfully!',
  });
});

const uploadBusinessImage = catchAsync(async (req, res, next) => {
  try {
    const { store } = req; // Tienda encontrada en el middleware
    const storeId = req.sessionStore.id;

    // Verificar si la tienda tiene permiso para actualizar la imagen
    if (store.id !== storeId) {
      return next(
        new AppError('You do not have permission to perform this action', 401)
      );
    }

    // Verificar si se subió la imagen del negocio
    if (!req.file) {
      return next(new AppError('Please upload a business image', 400));
    }

    // Cargar la imagen del negocio a Firebase Storage
    const businessImgRef = ref(
      storage,
      `stores/business-${Date.now()}-${req.file.originalname}`
    );

    const businessImgUpload = await uploadBytes(
      businessImgRef,
      req.file.buffer
    );

    // Obtener la URL pública de la imagen del negocio
    const businessImgRefToDownload = ref(
      storage,
      businessImgUpload.metadata.fullPath
    );
    const businessImgUrl = await getDownloadURL(businessImgRefToDownload);

    // Actualizar la tienda con la nueva URL de la imagen del negocio
    store.businessImgUrl = businessImgUrl; // Asignar la URL obtenida de Firebase
    await store.save(); // Guardar los cambios en la base de datos

    // Devolver la respuesta con los datos actualizados
    return res.status(200).json({
      status: 'success',
      message: 'Business image uploaded successfully',
      store: {
        id: store.id,
        name: store.name,
        businessImgUrl: businessImgUrl, // URL pública de la imagen del negocio
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  findAllStores,
  findOneStore,
  updateStore,
  deleteStore,
  uploadBusinessImage,
};
