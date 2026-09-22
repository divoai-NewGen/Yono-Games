import { NextRequest, NextResponse } from 'next/server';
import { createContactMessage } from '@/services/messageService';
import { sendContactEmailNotification } from '@/utils/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, category, message } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!email?.trim() || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required' }, { status: 400 });
    }
    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: 'Message content is required' }, { status: 400 });
    }

    // 1. Save to Database (Redis / Local JSON)
    const savedMessage = await createContactMessage({
      name: name.trim(),
      email: email.trim(),
      category: category || 'General Support',
      message: message.trim(),
    });

    // 2. Dispatch Email Notification to Yonogames2026@gmail.com asynchronously
    sendContactEmailNotification(savedMessage).catch((err) => {
      console.error('[Contact API] Email notification background error:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been received! Our support team will get back to you shortly.',
      data: savedMessage,
    });
  } catch (error: any) {
    console.error('[Contact API] Error handling contact form submission:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit message. Please try again.' },
      { status: 500 }
    );
  }
}
