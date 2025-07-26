'use client';
import React, { useState } from 'react';
import styles from './sign-up.module.css';
import Image from 'next/image';
import eyevisible from '../../../../../public/images/visible.svg';
import noteyevisible from '../../../../../public/images/not_visible.svg';
import { X } from 'lucide-react';
import Link from 'next/link';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    reenterPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupText, setShowPopupText] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = formData.password.length > 6;
  const doPasswordsMatch = formData.password === formData.reenterPassword;

  const isFormValid =
    formData.username &&
    isEmailValid(formData.email) &&
    isPasswordValid &&
    doPasswordsMatch;
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch('/api/auth?type=sign_up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.username,
        emailaddress: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.message === 'Added') {
      setShowPopup(true);
      setShowPopupText('Signup successful! Please check your email to confirm.');
       setFormData({
        username: '',
        email: '',
        password: '',
        reenterPassword: '',
      });
   
    } else if (response.status === 409) {
      setShowPopup(true);
      setShowPopupText('This email is already registered. Try logging in.');
    } else {
      alert(data.message || 'Something went wrong.');
    }
  } catch (error) {
    alert('Something went wrong.');
  } finally {
    setIsSubmitting(false);
  }
};


  const closePopup = () => setShowPopup(false);




  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <Image
            src={showPassword ? noteyevisible : eyevisible}
            alt="Toggle Password"
            className={styles.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        <div className={styles.passwordContainer}>
          <input
            type={showRePassword ? 'text' : 'password'}
            name="reenterPassword"
            placeholder="Re-enter Password"
            value={formData.reenterPassword}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <Image
            src={showRePassword ? noteyevisible : eyevisible}
            alt="Toggle Re-enter Password"
            className={styles.eyeIcon}
            onClick={() => setShowRePassword(!showRePassword)}
          />
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Sign Up'}
        </button>

      <Link href={'/auth/log-in'} className={styles.logintext}>Log in</Link>

        
      </form>

       {showPopup && (
        <div className="popup-container fade-in-up">
          <p className="popup-text">{showPopupText}</p>
          <button className="close-btn" onClick={closePopup}>
            <X size={20} />
          </button>
        </div>
      )}

   
    </div>
  );
}

export default SignUp;
