import multer from 'multer';
import path from 'path';
import { __dirname } from "../utils.js";
import fs from 'fs'; 
//--

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = ''; // Inicializar la ruta predeterminada como vacía
    const userId = req.params.uid; 
    switch (file.fieldname) {
      case 'identification':
      case 'addressProof':
      case 'bankStatement':
        uploadPath = path.join(__dirname, `public/documents/${userId}`); // Carpeta para estos campos
        // Utiliza fs.mkdirSync para crear la carpeta si no existe
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true }); // La opción recursive permite crear carpetas anidadas
        }
        break;
      case 'profiles':
        uploadPath = path.join(__dirname, `public/profiles/${userId}`); // Carpeta para estos campos
        // Utiliza fs.mkdirSync para crear la carpeta si no existe
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true }); // La opción recursive permite crear carpetas anidadas
        }
        break;
      default:
        cb(new Error('Tipo de archivo no válido'));
        return;
    }

    cb(null, uploadPath);
  },

  filename:function(req,file,cb){
    cb(null,`${Date.now()}-${file.originalname}`)
}
});

const uploader = multer({storage})

export default uploader;

