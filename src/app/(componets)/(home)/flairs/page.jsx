'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import threedotimageicon from '../../../../../public/images/3dot.svg'; 
import { useRouter } from 'next/navigation';
import NoDataFound from '@/app/(widgets)/nodatafound/page';
import { debounce } from 'lodash';
import { X } from 'lucide-react';
import useCheckLogin from '../useCheckLogin';

export default function FlairList() {

    useCheckLogin();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [flairToDelete, setFlairToDelete] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [flairs, setFlairs] = useState([]);
  const [loading, setLoading] = useState(true);



  const router = useRouter();
  const handleAddFlair = () => {
    router.push('/flairs/create-flair');
  };
    const handleUpdateFlair = (flair) => {
  router.push(`/flairs/create-flair?flairid=${flair.flairid}&flairname=${encodeURIComponent(flair.flairname)}`);
  };


  const toggleDropdown = (index) => {
    setActiveDropdown(prev => (prev === index ? null : index));
  };

  const wrapperRefs = useRef([]);

  const handleClickOutside = (event) => {
    if (
      wrapperRefs.current.every(
        (ref) => ref && !ref.contains(event.target)
      )
    ) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
    const openDeletePopup = (flair) => {
    setFlairToDelete(flair);
    setShowDeletePopup(true);
    setActiveDropdown(null);
  };

  // Close delete popup
  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setFlairToDelete(null);
  };


    useEffect(() => {
      const fetchFlair = async () => {
        try {
          const res = await fetch('/api/flair?type=fetch_flair_data', {
            method: 'POST'
          });
          const result = await res.json();
          
          setFlairs(result.data || []);
        } catch (err) {
          console.error('Error fetching categories:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchFlair();
    }, []);
  
  
  
  
  const searchCategory = async (e) => {
    const searchTerm = e.target.value;
  
    try {
      const res = await fetch('/api/flair?type=search_flair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flairname: searchTerm })
      });
  
      const result = await res.json();
      setFlairs(result.data || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };
  
  // ✅ Now debounce AFTER searchCategory is defined
  const debouncedSearchCategory = debounce(searchCategory, 300);



const confirmDelete = async () => {
  if (!flairToDelete) return;

  try {
    const res = await fetch('/api/flair?type=delete_flair', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flairid: flairToDelete.flairid }),
    });
    const data = await res.json();

    if (data.message === 'Deleted') {
  
      closeDeletePopup();

      // Fetch the updated flair list
      const fetchRes = await fetch('/api/flair?type=fetch_flair_data', { method: 'POST' });
      const fetchData = await fetchRes.json();
      setFlairs(fetchData.data || []);
    } else {
      alert(data.error || 'Failed to delete flaidddddr.');
    }
  } catch (error) {
    alert('Failed to delete flair.');
    console.error(error);
  }
};

  
  
  
  return (
    <>
      <div className='mainholder'>
        <h1 className="mainheading">Flair List</h1>
        <button onClick={handleAddFlair}>Add New</button>
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
            {flairs.length > 0 ? (
              flairs.map((flair, idx) => (
                <tr key={flair.id || idx}>
                  <td>{flair.flairname}</td>
                  <td>{new Date(flair.created_at).toLocaleDateString()}</td>
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
                         <span onClick={() => handleUpdateFlair(flair)}>Update</span>
                          <span
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={() => openDeletePopup(flair)}
                          >
                            Delete
                          </span>
                        </div>
                      )}

                       {showDeletePopup && (
                    <div className="popup-container fade-in-up">
                      <button className="close-btn" onClick={closeDeletePopup}><X size={18} /></button>
                      <p className="popup-text">Are you sure you want to delete <strong>{flairToDelete?.flairname}</strong>?</p>
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
