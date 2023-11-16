import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const sendEmail = async (name: string, email: string, phone: string) => {
  console.log(process.env.GMAIL_EMAIL_ADDRESS)
  console.log(process.env.GMAIL_APP_PASSWORD)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL_ADDRESS,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // Compose the email message
  const link = encodeURIComponent('http://localhost:3000/signup/authorized');
  const content = encodeURIComponent("Do not hesitate to contact us if you have any questions!");
  const mailOptions = {
    from: process.env.GMAIL_EMAIL_ADDRESS,
    to: email, // Replace with your own email address
    subject: 'CallSmart Confirm Email',
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`,

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
