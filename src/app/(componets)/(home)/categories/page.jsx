'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import threedotimageicon from '../../../../../public/images/3dot.svg'; 
import { useRouter } from 'next/navigation';
import NoDataFound from '@/app/(widgets)/nodatafound/page';
import { X } from 'lucide-react';
import { debounce } from 'lodash';
import useCheckLogin from '../useCheckLogin';

export default function CategoryList() {
  useCheckLogin();
  const [categories, setCategories] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
 

  const handleAddCategory = () => {
    router.push('/categories/create-category');
  };
  const handleUpdateCategory = (category) => {
  router.push(`/categories/create-category?cateid=${category.cateid}&categoryname=${encodeURIComponent(category.categoryname)}`);
  };
  


  const toggleDropdown = (index) => {
    setActiveDropdown(prev => (prev === index ? null : index));
  };

  const wrapperRefs = useRef([]);

  const handleClickOutside = (event) => {
    if (
      wrapperRefs.current.every(ref => ref && !ref.contains(event.target))
    ) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category?type=fetch_category_data', {
          method: 'POST'
        });
        const result = await res.json();
        
        setCategories(result.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  const openDeletePopup = (category) => {
    setCategoryToDelete(category);
    setShowDeletePopup(true);
    setActiveDropdown(null);
  };

  // Close delete popup
  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setCategoryToDelete(null);
  };




const confirmDelete = async () => {
  if (!categoryToDelete) return;

  try {
    const res = await fetch('/api/category?type=delete_category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cateid: categoryToDelete.cateid }),
    });
    const data = await res.json();

    if (res.ok) {
      closeDeletePopup();

      // Fetch the updated category list
      const fetchRes = await fetch('/api/category?type=fetch_category_data', { method: 'POST' });
      const fetchData = await fetchRes.json();
      setCategories(fetchData.data || []);
    } else {
      alert(data.error || 'Failed to delete category.');
    }
  } catch (error) {
    setSuccessMessage('Failed to delete category.');
  }
};

const searchCategory = async (e) => {
  const searchTerm = e.target.value;

  try {
    const res = await fetch('/api/category?type=search_category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryname: searchTerm })
    });

    const result = await res.json();
    setCategories(result.data || []);
  } catch (err) {
    console.error('Search failed:', err);
  }
};

// ✅ Now debounce AFTER searchCategory is defined
const debouncedSearchCategory = debounce(searchCategory, 300);


  return (
    <>
      <div className='mainholder'>
        <h1 className="mainheading">Categories List</h1>
        <button onClick={handleAddCategory}>Add New</button>
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
             <th>
              <div className="column-header">
                <span>Name</span>
                <input 
                type="text" 
                placeholder="Search here" 
                className="table-search-input" 
                onChange={debouncedSearchCategory}
              />
              </div>
            </th>
              

              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category, idx) => (
                <tr key={category.id || idx}>
                  <td>{category.categoryname}</td>
                  <td>{new Date(category.created_at).toLocaleDateString()}</td>
                  <td className="action-cell">
                    <div
                      className="dropdown-wrapper"
                      ref={(el) => (wrapperRefs.current[idx] = el)}
                    >
                      <button className="action-btn" onClick={() => toggleDropdown(idx)}>
                        <Image src={threedotimageicon} alt="menu" width={24} height={24} />
                      </button>
                      {activeDropdown === idx && (
                        <div className="dropdownsfor3dots">
                         <span onClick={() => handleUpdateCategory(category)}>Update</span>
                          <span
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={() => openDeletePopup(category)}
                          >
                            Delete
                          </span>
                        </div>
                      )}

                       {showDeletePopup && (
                    <div className="popup-container fade-in-up">
                      <button className="close-btn" onClick={closeDeletePopup}><X size={18} /></button>
                      <p className="popup-text">Are you sure you want to delete <strong>{categoryToDelete?.categoryname}</strong>?</p>
                      <div className="popup-actions">
                        <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
                        <button className="btn btn-secondary" onClick={closeDeletePopup}>Cancel</button>
                      </div>
                    </div>
                                  )}
                      

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan="3"><NoDataFound /></td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
