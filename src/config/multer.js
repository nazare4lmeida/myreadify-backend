const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// --- ALTERAÇÃO PRINCIPAL: USANDO MEMORYSTORAGE ---
// Em vez de salvar em disco, vamos manter o arquivo na memória (RAM)
// para que possamos enviá-lo diretamente para serviços como o Supabase.
const storage = multer.memoryStorage();

module.exports = {
  // A propriedade 'dest' não é mais necessária com memoryStorage
  storage: storage, // Usamos a nova configuração de armazenamento em memória
  limits: {
    fileSize: 2 * 1024 * 1024, // Limite de 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido. Apenas JPEG e PNG são permitidos.'));
    }
  },
};