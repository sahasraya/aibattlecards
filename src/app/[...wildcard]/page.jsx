'use client';

import React from 'react';
import notfoundimage from '../../../public/images/notfound.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './wildcard.module.css';

export default function NotFoundPage() {
  const router = useRouter();

  const gobacktodashboard = () => {
    router.push('/dashboard');  
  };

  return (
    <div className={styles.container}>
      <Image
        src={notfoundimage}
        alt="Page Not Found"
        className={styles.image}
        width={300}
        height={300}
      />
      <h1 className={styles.title}>404 - Page Not Found</h1>
      <p className={styles.message}>
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <button className={styles.backBtn} onClick={gobacktodashboard}>
        Go to Dashboard
      </button>
    </div>
  );
}
