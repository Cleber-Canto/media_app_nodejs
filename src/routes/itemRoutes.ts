import { Router } from 'express';
import upload from '../config/multer';
import {
    getItemsController,
    createItem,
    getItemController,
    updateItemController,
    deleteItemController
  } from '../controllers/itemController';
  
  const router = Router();
  
  router.get('/items', getItemsController);
  router.get('/items/:id', getItemController);
  router.post('/items', upload.fields([{ name: 'imageURL', maxCount: 1 }, { name: 'audioURL', maxCount: 1 }]), createItem);
  router.put('/items/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), updateItemController);
  router.delete('/items/:id', deleteItemController);
  
  export { router };