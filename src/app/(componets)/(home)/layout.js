'use client';

import React, { useState } from 'react';
import styles from './layout.module.css';
import Sidemenu from '@/app/(widgets)/sidemenu/sidemenu';

export default function HomeLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className={styles.layout}>
      <Sidemenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`${styles.mainContent} ${isSidebarOpen ? styles.shift : ''}`}>
        {children}
      </div>
    </div>
  );
}
  