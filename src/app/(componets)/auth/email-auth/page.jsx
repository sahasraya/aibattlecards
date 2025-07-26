'use client';

import React, { useEffect, useState } from 'react';
import styles from './email-auth.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import emailImage from '../../../../../public/images/email.png';

function EmailAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const adminuserid = searchParams.get('adminuserid');

  const [fadeIn, setFadeIn] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Verifying your email...');

useEffect(() => {
  setFadeIn(true); // Trigger fade-up transition on mount

  const verifyEmail = async () => {
    try {
      const response = await fetch('/api/auth?type=email_auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminuserid }), // ✅ correct key
      });

      const data = await response.json();

      if (response.ok && data.message === 'authenticated') {
        setStatusMessage('✅ Email verified successfully!');
      } else {
        setStatusMessage(`❌ ${data.message || 'Email verification failed.'}`);
      }
    } catch (error) {
      setStatusMessage('❌ Something went wrong. Please try again later.');
    }
  };

  if (adminuserid) {
    verifyEmail();
  } else {
    setStatusMessage('❌ Invalid or missing user ID.');
  }
}, [adminuserid]);


  return (
    <div className={`${styles.container} ${fadeIn ? styles.fadeUp : ''}`}>
      <Image src={emailImage} alt="Email verification" className={styles.emailImage} />
      <h2 className={styles.heading}>Email Verification</h2>
      <p className={styles.message}>{statusMessage}</p>
      <button className={styles.button} onClick={() => router.push('/auth/log-in')}>
        Go to Login
      </button>
    </div>
  );
}

export default EmailAuth;
