'use client';

import React from 'react';
import styles from './dashboard.module.css';
import useCheckLogin from '../useCheckLogin';

function Dashboard() {
  useCheckLogin();

  return (
    <div className='mainholder'>
      <h1 className="mainheading">Dashboard</h1>
    </div>
  );
}

export default Dashboard;
