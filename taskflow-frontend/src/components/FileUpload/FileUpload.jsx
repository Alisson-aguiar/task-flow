import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaUpload, FaFile, FaImage, FaFilePdf, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import './FileUpload.css';

const FileUpload = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxSize: 5242880 // 5MB
  });

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });
    
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUploadedFiles([...uploadedFiles, response.data.file]);
      setFiles([]);
      if (onUploadComplete) onUploadComplete(response.data.file);
      
    } catch (error) {
      console.error('Erro ao enviar arquivo', error);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <FaImage />;
    if (type === 'application/pdf') return <FaFilePdf />;
    return <FaFile />;
  };

  return (
    <div className="file-upload-container">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <FaUpload className="upload-icon" />
        <p>Arraste arquivos ou clique para selecionar</p>
        <span>Suporta: JPG, PNG, PDF (máx 5MB)</span>
      </div>

      {files.length > 0 && (
        <div className="files-preview">
          <h4>Arquivos selecionados:</h4>
          {files.map((file, index) => (
            <div key={index} className="file-item">
              {getFileIcon(file.type)}
              <span>{file.name}</span>
              <span className="file-size">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          ))}
          <div className="upload-actions">
            <button onClick={() => setFiles([])} className="cancel-upload">
              <FaTrash /> Cancelar
            </button>
            <button onClick={handleUpload} disabled={uploading} className="confirm-upload">
              {uploading ? 'Enviando...' : `Enviar ${files.length} arquivo(s)`}
            </button>
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Arquivos enviados:</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="uploaded-file">
              {getFileIcon(file.mimetype)}
              <a href={`http://localhost:3333${file.path}`} target="_blank" rel="noopener noreferrer">
                {file.filename}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
