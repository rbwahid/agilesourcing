import { NextRequest, NextResponse } from 'next/server';

const VALID_SUBJECTS = ['general', 'sales', 'support', 'partnership', 'other'];

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateFormData(data: ContactFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!validateEmail(data.email)) {
    errors.push('Invalid email address');
  }

  if (!data.subject || !VALID_SUBJECTS.includes(data.subject)) {
    errors.push('Invalid subject');
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.push('Message is required');
  } else if (data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, subject, message } = body as ContactFormData;

    // Validate form data
    const validation = validateFormData({ name, email, subject, message });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Get the subject label for the email
    const subjectLabels: Record<string, string> = {
      general: 'General Inquiry',
      sales: 'Sales Question',
      support: 'Technical Support',
      partnership: 'Partnership Opportunity',
      other: 'Other',
    };

    const subjectLabel = subjectLabels[subject] || 'Contact Form Submission';

    // Log the submission (for development)
    console.log('Contact form submission:', {
      name: name.trim(),
      email: email.trim(),
      subject: subjectLabel,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    });

    // TODO: Connect to backend mail service
    // Example: Send to Laravel backend API
    // const backendUrl = process.env.BACKEND_API_URL;
    // if (backendUrl) {
    //   await fetch(`${backendUrl}/api/contact`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       name: name.trim(),
    //       email: email.trim(),
    //       subject: subjectLabel,
    //       message: message.trim(),
    //     }),
    //   });
    // }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
