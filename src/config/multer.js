const multer = require('multer');

// Usaremos o armazenamento em memória para manter o arquivo como um buffer,
// ideal para fazer upload para serviços de nuvem como o Supabase.
const storage = multer.memoryStorage();

module.exports = {
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Aumentei o limite para 5MB, mais seguro
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido. Apenas JPEG e PNG são permitidos.'), false);
    }
  },
};