import { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box } from '@mui/material';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('description', description);

    try {
      await axios.post('https://nextjs-instagram-clone-5.onrender.com/upload', formData);
      setFile(null);
      setDescription('');
      setPreview(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  return (
    <Box>
      <input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" width="150" />}
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={2}
        margin="normal"
      />
      <Button onClick={handleUpload} variant="contained" color="primary">
        Upload
      </Button>
    </Box>
  );
}
