'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import hackedimage from '../../../../../public/images/hacked.png';
import styles from './not-authorized.module.css';
import Link from 'next/link';

function Notauthorized() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`${styles.container} ${visible ? styles.fadeIn : ''}`}>
      <Image src={hackedimage} alt="Unauthorized access" className={styles.image} priority />
      <h1 className={styles.title}>Oops! Suspicious Activity Detected</h1>
      <p className={styles.message}>
        Looks like you're trying to access something without logging in.
        <br />
        Please log in to continue 💖
      </p>

      <Link href="/auth/log-in" className={styles.loginLink}>
        Go to Login
      </Link>
    </div>
  );
}

export default Notauthorized;
