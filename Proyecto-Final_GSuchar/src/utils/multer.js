import multer from 'multer';
import path from 'path';
import { __dirname } from "../dirname.js"; // Si no lo dejo en Raiz me guarda en utils/public :/
import fs from 'fs';

// Verifica si el tipo de archivo es valido
const isFileTypeValid = (file) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  return allowedFileTypes.includes(file.mimetype);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';
    const userId = req.params.uid;

    // Valida el tipo de archivo
    if (!isFileTypeValid(file)) {
      cb(new Error('Tipo de archivo no válido'));
      return;
    }

    switch (file.fieldname) {
      case 'identification':
      case 'addressProof':
      case 'bankStatement':
        uploadPath = path.join(__dirname, `public/documents/${userId}`);
        // Utiliza fs.mkdirSync para crear la carpeta si no existe
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });// La opcion recursive permite crear carpetas anidadas
        }
        break;
      case 'profiles':
        uploadPath = path.join(__dirname, `public/profiles/${userId}`);
        // Utiliza fs.mkdirSync para crear la carpeta si no existe
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        break;
      default:
        cb(new Error('Tipo de archivo no válido'));
        return;
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Valida el tipo de archivo 
  if (isFileTypeValid(file)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no válido'), false);
  }
};

const uploader = multer({
  storage,
  fileFilter,
});

export default uploader;