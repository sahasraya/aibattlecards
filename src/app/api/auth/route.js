// src/app/api/auth/route.js

import { NextResponse } from 'next/server';
import pool from './db';
import nodemailer from 'nodemailer';


function generateRandomId(length = 30) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}



export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'sign_up') {
  try {
    const body = await request.json();
    const { name, emailaddress, password } = body;

    const adminuserid = generateRandomId(30);

    if (!name || !emailaddress || !password || !adminuserid) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if the email already exists
    const checkQuery = `SELECT 1 FROM adminuser WHERE emailaddress = $1 LIMIT 1`;
    const result = await pool.query(checkQuery, [emailaddress]);

    if (result.rows.length > 0) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }

    const insertQuery = `
      INSERT INTO adminuser (name, emailaddress, password, adminuserid)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(insertQuery, [name, emailaddress, password, adminuserid]);

    // Send confirmation email
    await sendEmail(emailaddress, adminuserid);

    return NextResponse.json({ message: 'Added' }, { status: 200 });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ message: 'Signup failed' }, { status: 500 });
  }
}

  
  
  
  
  
  
  
  
if (type === 'email_auth') {
    try {
      const body = await request.json();
      const { adminuserid } = body;

      if (!adminuserid) {
        return NextResponse.json({ message: 'Missing adminuserid' }, { status: 400 });
      }

      const updateQuery = `
        UPDATE adminuser 
        SET isemailconfirmed = true 
        WHERE adminuserid = $1
        RETURNING *;
      `;

      const result = await pool.query(updateQuery, [adminuserid]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: 'User not found or already confirmed' }, { status: 404 });
      }

      return NextResponse.json({ message: 'authenticated' }, { status: 200 });
    } catch (err) {
      console.error('Email verification error:', err);
      return NextResponse.json({ message: 'Verification failed' }, { status: 500 });
    }
  }



if (type === 'log_in') {
  try {
    const body = await request.json();
    const { emailaddress, password } = body;

    if (!emailaddress || !password) {
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    const emailCheckQuery = `
      SELECT adminuserid, password, isemailconfirmed
      FROM adminuser
      WHERE emailaddress = $1
    `;
    const emailResult = await pool.query(emailCheckQuery, [emailaddress]);

    if (emailResult.rowCount === 0) {
      return NextResponse.json({ message: 'Email not found' }, { status: 404 });
    }

    const user = emailResult.rows[0];

    if (!user.isemailconfirmed) {
      return NextResponse.json({ message: 'Please confirm your email before logging in.' }, { status: 403 });
    }

    if (user.password !== password) {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login successful',
      adminuserid: user.adminuserid
    }, { status: 200 });

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}





  






  return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
}

// Send email with template
async function sendEmail(to, adminuserid) {
  const sender_email = 'dilshanwickramaarachchi99@gmail.com';
  const password = 'lqtj loqv aiqz wsty';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: sender_email,
      pass: password,
    },
  });

  const emailHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #764ba2; text-align: center;">Welcome to Our Platform!</h2>
      <p>Hi there,</p>
      <p>Thank you for signing up! Please confirm your email by clicking the button below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="http://localhost:3000/auth/email-auth?adminuserid=${adminuserid}" style="background: #764ba2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Confirm Email
        </a>
      </div>
      <p>If you didn’t sign up, you can ignore this email.</p>
      <p style="color: #888;">Cheers,<br/>The Team</p>
    </div>
  `;

  const mailOptions = {
    from: `"Your App Name" <${sender_email}>`,
    to,
    subject: 'Confirm Your Email Address',
    html: emailHTML,
  };

  await transporter.sendMail(mailOptions);
}
