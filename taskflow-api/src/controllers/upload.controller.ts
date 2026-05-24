import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configurar storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filtrar arquivos
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export class UploadController {
  async uploadFile(req: Request, res: Response): Promise<Response> {
    try {
      const uploadSingle = upload.single('file');
      
      return new Promise((resolve, reject) => {
        uploadSingle(req, res, async (err: any) => {
          if (err) {
            return resolve(res.status(400).json({ message: err.message }));
          }
          
          const file = req.file;
          if (!file) {
            return resolve(res.status(400).json({ message: 'Nenhum arquivo enviado' }));
          }
          
          resolve(res.json({
            message: 'Arquivo enviado com sucesso',
            file: {
              filename: file.filename,
              path: `/uploads/${file.filename}`,
              size: file.size,
              mimetype: file.mimetype
            }
          }));
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao enviar arquivo' });
    }
  }
  
  async getFiles(req: Request, res: Response): Promise<Response> {
    try {
      const uploadDir = './uploads';
      if (!fs.existsSync(uploadDir)) {
        return res.json({ files: [] });
      }
      
      const files = fs.readdirSync(uploadDir);
      const fileList = files.map(filename => ({
        filename,
        path: `/uploads/${filename}`,
        url: `http://localhost:3333/uploads/${filename}`
      }));
      
      return res.json({ files: fileList });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao listar arquivos' });
    }
  }
}
