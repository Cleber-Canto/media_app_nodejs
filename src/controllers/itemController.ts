import { Request, Response } from 'express';
import * as itemService from '../services/itemService';

export const getItems = async (_req: Request, res: Response) => {
  try {
    const items = await itemService.getItems();
    console.log('Retrieved items:', items);
    res.json(items);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.id;
    const item = await itemService.getItem(itemId);
    if (!item) {
      console.log(`Item not found: ${itemId}`);
      return res.status(404).json({ message: 'Item not found' });
    }
    console.log('Retrieved item:', item);
    res.json(item);
  } catch (error) {
    console.error('Error retrieving item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const { title, artist, album, coverURL, description, isTrack, genero } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files?.['image']?.[0];
    const audio = files?.['audio']?.[0];

    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    if (!title || !artist || !album || !coverURL || !description || !genero) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newItem = await itemService.createItem({
      title,
      artist,
      album,
      coverURL,
      description,
      imageUrl: image ? `/uploads/${image.filename}` : '',
      audioUrl: audio ? `/uploads/${audio.filename}` : '',
      isTrack: isTrack === 'true',
      genero,
    });

    console.log('Created item:', newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.id;
    const { title, artist, album, coverURL, description, isTrack, genero } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files?.['image']?.[0];
    const audio = files?.['audio']?.[0];

    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    if (!title || !artist || !album || !coverURL || !description || !genero) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const updatedItem = await itemService.updateItem(itemId, {
      title,
      artist,
      album,
      coverURL,
      description,
      imageUrl: image ? `/uploads/${image.filename}` : undefined,
      audioUrl: audio ? `/uploads/${audio.filename}` : undefined,
      isTrack: isTrack === 'true',
      genero,
    });

    if (!updatedItem) {
      console.log(`Item not found for update: ${itemId}`);
      return res.status(404).json({ message: 'Item not found' });
    }

    console.log('Updated item:', updatedItem);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.id;
    const success = await itemService.deleteItem(itemId);

    if (success) {
      console.log(`Deleted item: ${itemId}`);
      res.status(200).json({ message: `Item ${itemId} deleted successfully.` });
    } else {
      console.log(`Item not found for deletion: ${itemId}`);
      res.status(404).json({ message: 'Item not found.' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);

    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
