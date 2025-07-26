'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './sidemenu.module.css';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Sidemenu({ isOpen, toggleSidebar }) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleLogoutClick = () => {
    setShowPopup(true);
    setFadeOut(false);
  };

  const closePopup = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 300); // match CSS transition duration
  };


  const logoutAndRedirect = () => {
  
  document.cookie = "adminuserid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

  // Redirect to login
  router.push('/auth/log-in');
  };
  

  return (
    <>
      <button className={styles.toggleBtn} onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.link}>Dashboard</Link>
          <Link href="/users" className={styles.link}>User</Link>
          <Link href="/products" className={styles.link}>Product</Link>
          <Link href="/categories" className={styles.link}>Category</Link>
          <Link href="/flairs" className={styles.link}>Flair</Link>
          <Link href="/reports" className={styles.link}>Reports</Link>
        </nav>

        <div className={styles.logoutWrapper}>
          <button className={styles.logoutBtn} onClick={handleLogoutClick}>Logout</button>
        </div>
      </aside>

      {showPopup && (
        <div className={`${styles.popupOverlay} ${fadeOut ? styles.fadeOut : styles.fadeIn}`}>
          <div className={styles.popup}>
            <p>Are you sure you want to logout ?</p>
            <div className={styles.popupActions}>
              <button onClick={ logoutAndRedirect}>Yes</button>
              <button onClick={closePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidemenu;
