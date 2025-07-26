'use client';

import React, { useState, useEffect } from 'react';
import styles from './log-in.module.css';
import Image from 'next/image';
import eyevisible from '../../../../../public/images/visible.svg';
import noteyevisible from '../../../../../public/images/not_visible.svg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailPattern.test(formData.email));
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setStatusMessage('');

  try {
    const response = await fetch('/api/auth?type=log_in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailaddress: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.message === 'Login successful') {
        Cookies.set('adminuserid', data.adminuserid, { expires: 365 });
        setStatusMessage(`✅ ${data.message}`);
        router.push('/dashboard');
      
      } else {
        // Any other success message, just show it
        setStatusMessage(`ℹ️ ${data.message}`);
      }
    } else {
      // Handle errors returned from server with explicit messages
      setStatusMessage(`❌ ${data.message || 'Login failed'}`);
    }
  } catch (error) {
    setStatusMessage('❌ Something went wrong. Please try again.');
    console.error('Login error:', error);
  } finally {
    setIsSubmitting(false);
  }
};


  const isFormValid = isValidEmail && formData.password.length >= 6;

  return (
    <div className={styles.container}>
      
      <div className={styles.heading}>Log In</div>
      {statusMessage && <div className={styles.status}>{statusMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <Image
            src={showPassword ? eyevisible : noteyevisible}
            alt="Toggle password"
            className={styles.eyeIcon}
            onClick={() => setShowPassword((prev) => !prev)}
          />
        </div>
        <button
          type="submit"
          className={styles.button}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>

        <Link href={'/auth/sign-up'} className={styles.logintext}>Sign Up</Link>



      </form>
    
    </div>
  );
}

export default Login;
