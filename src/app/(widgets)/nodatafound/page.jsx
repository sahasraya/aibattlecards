import React from 'react';
import styles from './nodatafound.module.css';

export default function NoDataFound() {
  return (
    <div className={styles.noDataWrapper}>
      <div className={styles.noDataBox}>
        <span className={styles.emoji}>📭</span>
        <h2 className='h2'>No Data Found</h2>
      </div>
    </div>
  );
}
