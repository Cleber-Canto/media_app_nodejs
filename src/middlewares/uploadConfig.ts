import multer, { FileFilterCallback } from 'multer';
import { extname, resolve } from 'path';
import { Request } from 'express';

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, resolve(__dirname, '..', 'uploads'));
  },
  filename: (_req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    callback(null, filename);
  },
});

// Função para validar se o arquivo é uma imagem ou áudio
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
    cb(null, true); // Aceita o arquivo
  } else {
    cb(new Error('Formato de arquivo não suportado: Apenas imagens e áudios são permitidos') as unknown as null, false); // Rejeita o arquivo
  }
};

// Criação do middleware de upload com a configuração de storage e fileFilter
const upload = multer({
  storage,
  fileFilter,
});

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]);

export { uploadFields };
