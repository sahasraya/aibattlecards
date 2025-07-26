'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import threedotimageicon from '../../../../../public/images/3dot.svg'; 
import { useRouter } from 'next/navigation';
import NoDataFound from '@/app/(widgets)/nodatafound/page';


export default function UserList() {

  const [activeDropdown, setActiveDropdown] = useState(null);
 

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

  const users = [
    { name: 'Alfreds Futterkiste', date: 'december - 15 - 2025' },
    { name: 'Alfreds Futterkiste', date: 'december - 15 - 2025' },
    { name: 'Alfreds Futterkiste', date: 'december - 15 - 2025' },
    { name: 'Alfreds Futterkiste', date: 'december - 15 - 2025' },
    
  ];

  return (
    <>
      <div className='mainholder'>
        <h1 className="mainheading">Users List</h1>
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td>{user.name}</td>
                <td>{user.date}</td>
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
                        <span>Preview</span>
                        <span>Update</span>
                        <span>Delete</span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoDataFound/> 

      
    </>
  );
}
