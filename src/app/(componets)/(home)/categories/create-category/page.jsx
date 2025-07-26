'use client';

import React, { useState, useEffect } from 'react';
import { useRouter,useSearchParams  } from 'next/navigation';
import Image from 'next/image';
import backarrrowimageicon from '../../../../../../public/images/back.svg';
import styles from './category.module.css';
import { X } from 'lucide-react';

function CreateCategory() {
  const router = useRouter();
  
  const searchParams = useSearchParams(); 

  const cateid = searchParams.get('cateid');
  const initialName = searchParams.get('categoryname') || '';
  


  const [formData, setFormData] = useState({
    categoryname: initialName,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupText, setShowPopupText] = useState('');

  useEffect(() => {
    setIsFormValid(formData.categoryname.trim().length > 0);
  }, [formData]);

  useEffect(() => {
    setFormData({ categoryname: initialName });
  }, [initialName]);



  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

const createCategory = async () => {
    try {
      const response = await fetch('/api/category?type=create_new_category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryname: formData.categoryname }),
      });

      const data = await response.json();

      if (response.ok && data.message === 'Added') {
        setShowPopup(true);
        setFormData({ categoryname: '' });
        setShowPopupText('Added category successfully !');
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

  const updateCategory = async () => {
    try {
      const response = await fetch('/api/category?type=update_category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cateid, categoryname: formData.categoryname }),
      });

      const data = await response.json();

      if (response.ok && data.message === 'Updated') {
        setShowPopup(true);
        setShowPopupText('Updated category successfully !');
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

    if (cateid) {
      await updateCategory();
    } else {
      await createCategory();
    }
  };




  const handleBackClick = () => {
    router.back();
  };
  const closePopup = () => setShowPopup(false);


  return (
    <>
      <div className='mainholder'>
        <div className="heading-wrapper">
          <div className="back-icon" onClick={handleBackClick}>
            <Image src={backarrrowimageicon} alt="Back" width={28} height={28} />
          </div>
          <h1 className="mainheading">Create Category</h1>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>

        <label htmlFor="categoryname" className={styles.categoryname}>Category Name</label>
        <input
          type="text"
          name="categoryname"
          id="categoryname"
          placeholder="Enter category name"
          value={formData.categoryname}
          onChange={handleChange}
          className={styles.input}
          required
        />

        {!cateid ? (
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Please wait...' : 'Create Category'}
          </button>
        ) : (
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Please wait...' : 'Update Category'}
          </button>
        )}
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

export default CreateCategory;
