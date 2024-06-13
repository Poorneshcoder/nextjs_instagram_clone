"use client";

import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function UploadForm() {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('description', description);

    try {
      setError(''); // Clear any previous error
      await axios.post('https://nextjs-instagram-clone-5.onrender.com/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPhoto(null);
      setPhotoPreview(null);
      setDescription('');
      setFileInputKey(Date.now()); // Reset the file input
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload photo. Please try again.');
    }
  };

  return (
    <Box>
      <input
        key={fileInputKey} // Ensure the file input is reset by using a unique key
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
      />
      {photoPreview && (
        <Box mt={2}>
          <img src={photoPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        </Box>
      )}
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button onClick={handleUpload} variant="contained" color="primary">Upload</Button>
    </Box>
  );
}
