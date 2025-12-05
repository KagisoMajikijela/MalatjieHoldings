// netlify/functions/process-contact.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Parse the form data
  const params = new URLSearchParams(event.body);
  const formData = Object.fromEntries(params);
  
  // Create the professional email body
  const emailBody = `Hello,

You have received a new contact form submission from your website. Details are as follows:

Full Name: ${formData.name || 'Not provided'}
Email Address: ${formData.email || 'Not provided'}
Phone Number: ${formData.phone || 'Not provided'}
Company Name: ${formData.company || 'Not provided'}
Service Interested In: ${formData.service || 'Not provided'}
Message: ${formData.message || 'Not provided'}
Subscribe to Newsletter: ${formData.newsletter ? 'Yes' : 'No'}

This message was sent via the TK Malatji Holdings website contact form.`;

  // Send email using Netlify's email service (requires setup)
  try {
    // Method 1: Using Netlify's built-in email (if configured)
    const response = await fetch(`${process.env.URL}/.netlify/functions/emails/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NETLIFY_EMAILS_SECRET}`
      },
      body: JSON.stringify({
        from: 'website@tkmalatsjeholdings.netlify.app',
        to: 'accounts@tkmalatjiholdingsptyltd.co.za',
        subject: `New Contact Form Submission from ${formData.name || 'Visitor'} – TK Malatji Holdings`,
        text: emailBody
      })
    });

    if (!response.ok) {
      throw new Error('Email failed');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully' })
    };
  } catch (error) {
    // Fallback: Log to console and still accept form
    console.log('Professional Email would have been:', emailBody);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Form submitted. Email logged for setup.' 
      })
    };
  }
};