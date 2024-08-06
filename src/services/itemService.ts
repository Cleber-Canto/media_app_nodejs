import { PrismaClient, Item } from '@prisma/client';

const prisma = new PrismaClient();

export const getItems = async (): Promise<Item[]> => {
  return prisma.item.findMany();
};

export const getItem = async (id: string): Promise<Item | null> => {
  return prisma.item.findUnique({
    where: { id },
  });
};

interface CreateItemInput {
  title: string;
  artist: string;
  album: string;
  coverURL: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  isTrack: boolean;
  genero: string;
}

export const createItem = async (input: CreateItemInput): Promise<Item> => {
  return prisma.item.create({
    data: input,
  });
};

interface UpdateItemInput {
  title?: string;
  artist?: string;
  album?: string;
  coverURL?: string;
  description?: string;
  imageUrl?: string;
  audioUrl?: string;
  isTrack?: boolean;
  genero?: string;
}

export const updateItem = async (id: string, input: UpdateItemInput): Promise<Item | null> => {
  return prisma.item.update({
    where: { id },
    data: input,
  });
};

export const deleteItem = async (id: string): Promise<boolean> => {
  const item = await prisma.item.findUnique({
    where: { id },
  });

  if (!item) {
    return false;
  }

  // Excluir registros dependentes na tabela Purchase
  await prisma.purchase.deleteMany({
    where: { itemId: id },
  });

  // Agora, podemos excluir o item
  await prisma.item.delete({
    where: { id },
  });

  return true;
};
