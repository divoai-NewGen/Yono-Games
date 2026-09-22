import { NextRequest, NextResponse } from 'next/server';
import {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from '@/services/messageService';

// GET all contact messages
export async function GET() {
  try {
    const messages = await getContactMessages();
    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// PUT update message read/unread status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Message ID and status are required' },
        { status: 400 }
      );
    }

    const updated = await updateContactMessageStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update message' },
      { status: 500 }
    );
  }
}

// DELETE a contact message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const deleted = await deleteContactMessage(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Message not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete message' },
      { status: 500 }
    );
  }
}
