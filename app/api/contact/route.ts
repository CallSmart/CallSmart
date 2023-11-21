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
  const mailOptions = {
    from: process.env.GMAIL_EMAIL_ADDRESS,
    to: email, // Replace with your own email address
    subject: 'CallSmart: Your Next Step to Streamlining Your Dental Clinic Communications',
    html: `
      <p>Dear ${name},</p>
      <p>Thank you for taking the first step towards enhancing your dental clinic's communication efficiency with CallSmart's AI-based missed call text back automation. We're excited to help you optimize your patient interactions and streamline your workflow.</p>
      <p>To get started, please click on the link below and follow the quick process to get started today!</p>
      <p><a href="https://callsmartai.ca/signup/makeAccount">https://callsmartai.ca/signup/makeAccount</a></p>
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
