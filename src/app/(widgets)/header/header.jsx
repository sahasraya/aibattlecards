
import React from 'react';
import Link from 'next/link';
import styles from './header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>MyApp</div>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>Home</Link>
        <Link href="/profile" className={styles.navLink}>Profile</Link>
        <Link href="/product" className={styles.navLink}>Product</Link>
        <Link href="/about" className={styles.navLink}>About</Link>
        <Link href="/contact" className={styles.navLink}>Contact</Link>
      </nav>
    </header>
  );
}

export default Header;
