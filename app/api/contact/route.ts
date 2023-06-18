import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';



const sendEmail = async (name: string, email: string, phone: string) => {
  console.log(process.env.GMAIL_EMAIL_ADDRESS)
  console.log(process.env.GMAIL_APP_PASSWORD)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_EMAIL_ADDRESS,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // Compose the email message
  const link = encodeURIComponent('http://localhost:3000/signup/makeAccount');
  const content = encodeURIComponent("Do not hesitate to contact us if you have any questions!");
  const mailOptions = {
    from: process.env.GMAIL_EMAIL_ADDRESS,
    to: process.env.GMAIL_EMAIL_ADDRESS, // Replace with your own email address
    subject: 'New Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`,
    html: `
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
      <p>Reply to this email:</p>
      <a href="mailto:${email}?subject=CallSmart%20information&body=This%20is%20the%20link%20to%20the%20pricing%20page:%0A%0A${link}%0A%0A${content}">Reply</a>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export async function POST(
  req: Request
  ) {
  if (req.method === 'POST') {
    const { name, email, phone } = await req.json();

    // Validate the form data (e.g., check if required fields are filled)

    // Send the email
    try {
      await sendEmail(name, email, phone);
      return NextResponse.json({ message: 'email sent succesfully' });
    } catch (error) {
      console.error(error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  } else {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
