'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import backarrrowimageicon from '../../../../../../public/images/back.svg';
import styles from '../../categories/create-category/category.module.css';

function CreateFlair() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const flairid = searchParams.get('flairid');
  const initialName = searchParams.get('flairname') || '';

  const [formData, setFormData] = useState({
    flairname: initialName,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupText, setShowPopupText] = useState('');

  useEffect(() => {
    setIsFormValid(formData.flairname.trim().length > 0);
  }, [formData]);

  useEffect(() => {
    setFormData({ flairname: initialName });
  }, [initialName]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const createFlair = async () => {
    try {
      const response = await fetch('/api/flair?type=create_new_flair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flairname: formData.flairname }),
      });

      const data = await response.json();

      if (response.ok && data.message === 'Added') {
        setShowPopup(true);
        setFormData({ flairname: '' });
        setShowPopupText('Added flair successfully!');
        setTimeout(() => setShowPopup(false), 3000);
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (error) {
      alert('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFlair = async () => {
    try {
      const response = await fetch('/api/flair?type=update_flair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flairid, flairname: formData.flairname }),
      });

      const data = await response.json();

      if (response.ok && data.message === 'Updated') {
        setShowPopup(true);
        setShowPopupText('Updated flair successfully!');
        setTimeout(() => setShowPopup(false), 3000);
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (error) {
      alert('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (flairid) {
      await updateFlair();
    } else {
      await createFlair();
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  const closePopup = () => setShowPopup(false);

  return (
    <>
      <div className="mainholder">
        <div className="heading-wrapper">
          <div className="back-icon" onClick={handleBackClick}>
            <Image src={backarrrowimageicon} alt="Back" width={28} height={28} />
          </div>
          <h1 className="mainheading">Create Flair</h1>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="flairname" className={styles.categoryname}>Flair Name</label>
        <input
          type="text"
          name="flairname"
          id="flairname"
          placeholder="Enter Flair Name"
          value={formData.flairname}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Please wait...' : (flairid ? 'Update Flair' : 'Create Flair')}
        </button>
      </form>

      {showPopup && (
        <div className="popup-container fade-in-up">
          <p className="popup-text">{showPopupText}</p>
          <button className="close-btn" onClick={closePopup}>
            <X size={20} />
          </button>
        </div>
      )}
    </>
  );
}

export default CreateFlair;
