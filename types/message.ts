export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read';
}
