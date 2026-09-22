import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import { ContactMessage } from '@/types/message';

const MESSAGES_JSON_PATH = path.join(process.cwd(), 'data', 'messages.json');
const REDIS_KEY = 'yono_contact_messages';

function getRedisClient(): Redis | null {
  const url = 
    process.env.UPSTASH_REDIS_REST_URL || 
    process.env.KV_REST_API_URL || 
    process.env.STORAGE_REST_API_URL || 
    process.env.STORAGE_URL;
  const token = 
    process.env.UPSTASH_REDIS_REST_TOKEN || 
    process.env.KV_REST_API_TOKEN || 
    process.env.STORAGE_REST_API_TOKEN || 
    process.env.STORAGE_TOKEN;
  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

async function readMessagesFromStorage(): Promise<ContactMessage[]> {
  const redis = getRedisClient();

  // 1. Cloud Redis / Vercel KV
  if (redis) {
    try {
      const messages = await redis.get<ContactMessage[]>(REDIS_KEY);
      if (Array.isArray(messages)) {
        return messages;
      }
      return [];
    } catch (err) {
      console.error('Redis read error for messages:', err);
    }
  }

  // 2. Local fallback: data/messages.json
  try {
    if (fs.existsSync(MESSAGES_JSON_PATH)) {
      const fileData = await fs.promises.readFile(MESSAGES_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading messages.json:', err);
  }
  return [];
}

async function writeMessagesToStorage(messages: ContactMessage[]): Promise<void> {
  const redis = getRedisClient();

  // 1. Cloud Redis / Vercel KV
  if (redis) {
    try {
      await redis.set(REDIS_KEY, messages);
      return;
    } catch (err) {
      console.error('Redis write error for messages:', err);
    }
  }

  // 2. Local fallback
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      await fs.promises.mkdir(dataDir, { recursive: true });
    }
    await fs.promises.writeFile(MESSAGES_JSON_PATH, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (err) {
    console.error('Local messages file write error:', err);
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const messages = await readMessagesFromStorage();
  // Return sorted newest first
  return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createContactMessage(
  data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>
): Promise<ContactMessage> {
  const messages = await readMessagesFromStorage();
  
  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    email: data.email.trim(),
    category: data.category || 'General Support',
    message: data.message.trim(),
    createdAt: new Date().toISOString(),
    status: 'unread',
  };

  const updatedList = [newMessage, ...messages];
  await writeMessagesToStorage(updatedList);
  return newMessage;
}

export async function updateContactMessageStatus(
  id: string,
  status: 'unread' | 'read'
): Promise<ContactMessage | null> {
  const messages = await readMessagesFromStorage();
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) return null;

  messages[index] = {
    ...messages[index],
    status,
  };

  await writeMessagesToStorage(messages);
  return messages[index];
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const messages = await readMessagesFromStorage();
  const filtered = messages.filter((m) => m.id !== id);
  if (filtered.length === messages.length) return false;

  await writeMessagesToStorage(filtered);
  return true;
}
