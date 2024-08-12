import { Request, Response } from 'express';
import { createItem as createItemService , getItems, getItemById, updateItem, UpdateItemInput, deleteItem} from '../services/itemService';

export const createItem = async (req: Request, res: Response) => {
  try {
    const {
      title,
      artist,
      album,
      coverURL,
      description,
      isTrack,
      genero,
    } = req.body;

    // Use os nomes corretos dos campos
    const imageFile = req.files?.['imageURL']?.[0];
    const audioFile = req.files?.['audioURL']?.[0];

    if (!imageFile || !audioFile) {
      console.error('Missing required files: imageURL and/or audioURL');
      return res.status(400).json({ message: 'Missing required files: imageURL and/or audioURL' });
    }

    // Atribua os URLs com base nos arquivos enviados
    const finalImageUrl = `/uploads/${imageFile.filename}`;
    const finalAudioUrl = `/uploads/${audioFile.filename}`;

    // Criação do novo item
    const newItem = await createItemService({
      title,
      artist,
      album,
      coverURL,
      description,
      imageUrl: finalImageUrl,
      audioUrl: finalAudioUrl,
      isTrack: isTrack === 'true',
      genero,
    });

    // Log detalhado da operação no terminal
    console.log('New item created successfully:');
    console.log(`Title: ${title}`);
    console.log(`Artist: ${artist}`);
    console.log(`Album: ${album}`);
    console.log(`Cover URL: ${coverURL}`);
    console.log(`Description: ${description}`);
    console.log(`Image URL: ${finalImageUrl}`);
    console.log(`Audio URL: ${finalAudioUrl}`);
    console.log(`Is Track: ${isTrack === 'true'}`);
    console.log(`Genere: ${genero}`);

    // Enviar a resposta JSON
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getItemsController = async (_req: Request, res: Response) => {
  try {
    const items = await getItems();
    res.json(items);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getItemController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const item = await getItemById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error retrieving item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateItemController = async (req: Request, res: Response) => {
  const itemId = req.params.id;
  const {
    title,
    artist,
    album,
    coverURL,
    description,
    isTrack,
    genero,
  } = req.body;

  const image = req.files?.['image']?.[0];
  const audio = req.files?.['audio']?.[0];

  const updateData: UpdateItemInput = {
    title,
    artist,
    album,
    coverURL,
    description,
    imageUrl: image ? `/uploads/${image.filename}` : undefined,
    audioUrl: audio ? `/uploads/${audio.filename}` : undefined,
    isTrack,
    genero,
  };

  try {
    const updatedItem = await updateItem(itemId, updateData);
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteItemController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const success = await deleteItem(id);
    if (success) {
      res.status(204).send();  // Nenhum conteúdo, mas indica sucesso na deleção
    } else {
      res.status(404).json({ message: 'Item not found' });  // Item não encontrado para deleção
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Internal Server Error' });  // Erro interno do servidor
  }
};
