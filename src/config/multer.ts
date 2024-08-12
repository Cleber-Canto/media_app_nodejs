import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '..', '..', 'uploads'),
  filename: (request, file, callback) => {
    const fileHash = crypto.randomBytes(10).toString('hex');
    const fileName = `${fileHash}-${file.originalname}`;
    callback(null, fileName);
  },
});

const upload = multer({ storage });

export default upload;
