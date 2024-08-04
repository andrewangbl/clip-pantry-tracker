'use client'

import {Box, Stack, Typography, Button, Modal, TextField} from '@mui/material'
import {firestore} from '@/firebase'
import {collection, getDocs, query, doc, setDoc, deleteDoc, getDoc} from 'firebase/firestore'
import {useEffect, useState, useRef} from 'react'
import AddItemButton from './components/AddItemButton'


import QuantityInput from './components/QuantityInput'

// bug  1: pork and Pork are different item


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display:'flex',
  flexDirection:'column',
  gap:3 ,
};

export default function Home() {
  const [pantryList, setPantryList] = useState([])

  const camera = useRef(null);

  const captureImage = () => {
    if (camera.current) {
      const imageSrc = camera.current.takePhoto();
      setCapturedImage(imageSrc);
    }
  };

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc)=>{
      pantryList.push({name:doc.id, count:doc.data().count})
    })
    console.log(pantryList)
    setPantryList(pantryList)
  }

  useEffect(()=>{
    updatePantry()
  },[])

  const addItem = async (item) => {
    const lowercasedItem = item.toLowerCase();
    const docRef = doc(collection(firestore, 'pantry'), lowercasedItem);
    // check if exists
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count + 1})
    }else{
      await setDoc(docRef, {count: 1})
    }

    await updatePantry()
  }

  const updateItemCount = async (name, newValue) => {
    const docRef = doc(collection(firestore, 'pantry'), name.toLowerCase());
    if (newValue > 0) {
      await setDoc(docRef, { count: newValue });
    } else {
      await deleteDoc(docRef);
    }
    await updatePantry();
  };


  const removeItem = async (item) => {
    const docRef = doc(collection(firestore,'pantry'), item)
    await deleteDoc(docRef)
    await updatePantry()
  }

  return (


    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <h1>Robot Pantry Tracker 🤖</h1>

      <AddItemButton onAddItem={addItem} />

      <Box border={'1px solid #333'}>
        <Box
        width="800px"
        height="70px"
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        >
          <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>

      <Stack width="800px" height="500px" spacing={2} overflow={'auto'}>
        {pantryList.map(({name, count}) => (
          <Box
            key={name}
            width="100%"
            minHeight="80px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            paddingX={2}
          >
            <Box width="30%">
              <Typography variant={'body1'} color={'#333'}>
                {name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Typography>
            </Box>

            <Box width="40%" display="flex" justifyContent="center">
              <QuantityInput
                value={count}
                onChange={(newValue) => updateItemCount(name, newValue)}
                min={0}
              />
            </Box>

            <Box width="30%" display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={() => removeItem(name)}>Delete</Button>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
    </Box>
  );
}
