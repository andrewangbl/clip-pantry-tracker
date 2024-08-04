'use client';

import React, { useState, useRef } from 'react';
import { Button, Modal, Box, Typography, TextField, Stack, CircularProgress } from '@mui/material';
import TinyBarChart from './TinyBarChart';
import { Camera } from 'react-camera-pro';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxWidth: '600px',
  height: 'auto',
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const AddItemButton = ({ onAddItem }) => {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const camera = useRef(null);
  const [cameraKey, setCameraKey] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName('');
    setPrediction(null);
    setCameraOpen(false);
    setTempImage(null);
  };

  const handleAddItem = () => {
    onAddItem(itemName.toLowerCase());
    handleClose();
  };

  const captureImage = () => {
    setCameraKey(prevKey => prevKey + 1); // Reset camera key
    setTempImage(null); // Reset tempImage state
    if (camera.current) {
      const imageSrc = camera.current.takePhoto();

      // Create a temporary canvas to crop the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set canvas size to 224x224
        canvas.width = 224;
        canvas.height = 224;

        // Calculate dimensions for cropping
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        // Draw the cropped image on the canvas
        ctx.drawImage(img, startX, startY, size, size, 0, 0, 224, 224);

        // Get the cropped image as base64
        const croppedImageSrc = canvas.toDataURL('image/jpeg');
        setTempImage(croppedImageSrc);
      };

      img.src = imageSrc;
    } else {
      console.error('Camera ref is not available');
    }
  };

  const submitImage = async () => {
    setIsLoading(true);
    const base64Data = tempImage.split(',')[1];

    console.log('Sending request to /api/process-image');
    try {
      const response = await fetch('/api/process-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_data: base64Data }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', JSON.stringify(Array.from(response.headers.entries())));

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Classify confidence
      let confidence;
      if (data.top_k_scores[0] > 0.8) {
        confidence = 'High';
      } else if (data.top_k_scores[0] > 0.6) {
        confidence = 'Mid';
      } else {
        confidence = 'Low';
      }

      setPrediction({ ...data, confidence });
      setItemName(data.item);
    } catch (error) {
      console.error('Error processing image:', error);
      console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    } finally {
      setIsLoading(false);
      setCameraOpen(false);
      setTempImage(null);
    }
  };

  const handleCameraClose = () => {
    setCameraOpen(false);
    if (prediction && prediction.item) {
      setItemName(prediction.item);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Add Item
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            {!prediction && (
              <Button variant="outlined" onClick={() => setCameraOpen(true)}>
                Take Photo
              </Button>
            )}
          </Stack>
          {prediction && (
            <Box>
              <Typography color={
                prediction.confidence === 'High' ? 'success.main' :
                prediction.confidence === 'Mid' ? 'warning.main' :
                'error.main'
              }>
                Confidence: {prediction.confidence}
              </Typography>
              <Typography variant="h6" mt={2} mb={1}>Top 5 Predictions</Typography>
              <Box sx={{ overflowX: 'auto', width: '100%' }}>
                <TinyBarChart items={prediction.top_k_items} scores={prediction.top_k_scores} />
              </Box>
            </Box>
          )}
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddItem}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={cameraOpen}
        onClose={handleCameraClose}
        aria-labelledby="camera-modal-title"
        aria-describedby="camera-modal-description"
      >
        <Box sx={{ ...style, width: 'auto', height: 'auto', maxWidth: '90vw', maxHeight: '90vh' }}>
          <Typography id="camera-modal-title" variant="h6" component="h2">
            Capture Item
          </Typography>
          {!tempImage && (
            <Box sx={{ width: 224, height: 224, overflow: 'hidden' }}>
              <Camera key={cameraKey} ref={camera} aspectRatio={1} />
            </Box>
          )}
          {tempImage && (
            <img
              src={tempImage}
              alt="captured"
              style={{ width: 224, height: 224, objectFit: 'cover' }}
            />
          )}
          <Stack direction="row" spacing={2} mt={2}>
            <Button onClick={captureImage} variant="contained" disabled={isLoading}>
              {tempImage ? 'Retake Photo' : 'Take Photo'}
            </Button>
            {tempImage && (
              <Button onClick={submitImage} variant="contained" color="success" disabled={isLoading}>
                Submit Photo
              </Button>
            )}
          </Stack>
          {isLoading && <CircularProgress sx={{ mt: 2 }} />}
          <Button variant="outlined" onClick={handleCameraClose} sx={{ mt: 2 }}>
            Close Camera
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AddItemButton;
