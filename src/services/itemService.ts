import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
export type UpdateItemInput = {
  title?: string;
  artist?: string;
  album?: string;
  coverURL?: string;
  description?: string;
  imageUrl?: string;
  audioUrl?: string;
  isTrack?: boolean;
  genero?: string;
};

type CreateItemInput = Prisma.ItemCreateInput;

export const createItem = async (input: CreateItemInput) => {
  return prisma.item.create({
    data: {
      title: input.title,
      artist: input.artist,
      album: input.album,
      coverURL: input.coverURL || '',
      description: input.description || '',
      imageUrl: input.imageUrl || '',
      audioUrl: input.audioUrl || '',
      isTrack: input.isTrack || false, 
      genero: input.genero || '',
    },
  });
};

export async function getItems() {
  try {
    const items = await prisma.item.findMany();
    return items;
  } catch (error) {
    console.error('Error retrieving items:', error);
    throw error;
  }
}

// Função para obter um item pelo ID
export async function getItemById(id: string) {
  try {
    const item = await prisma.item.findUnique({
      where: { id }
    });
    return item;
  } catch (error) {
    console.error('Error retrieving item by ID:', error);
    throw error;
  }
}

// Função para atualizar um item
export const updateItem = async (id: string, input: UpdateItemInput) => {
  try {
    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        title: input.title,
        artist: input.artist,
        album: input.album,
        coverURL: input.coverURL,
        description: input.description,
        imageUrl: input.imageUrl,
        audioUrl: input.audioUrl,
        isTrack: input.isTrack,
        genero: input.genero,
      },
    });
    return updatedItem;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;  // Propaga o erro para tratamento externo
  }
};

// Função para deletar um item
export const deleteItem = async (id: string) => {
  try {
    await prisma.item.delete({
      where: { id }
    });
    return true;  // Retorna verdadeiro se a deleção for bem-sucedida
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;  // Propaga o erro para tratamento externo
  }
};