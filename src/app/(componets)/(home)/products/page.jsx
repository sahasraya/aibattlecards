'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import threedotimageicon from '../../../../../public/images/3dot.svg'; 
import { useRouter } from 'next/navigation';
import NoDataFound from '@/app/(widgets)/nodatafound/page';
import defaultimage from '../../../../../public/images/defaultimage.jpg'
import useCheckLogin from '../useCheckLogin';


export default function ProductList() {

  useCheckLogin();


  const [activeDropdown, setActiveDropdown] = useState(null);
  const router = useRouter();
  const handleAddCategory = () => {
    router.push('/categories/create-category');
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

   const products = [
     {
      logo: '',
      name: 'AI Assistant Pro', 
      website: 'https://aipro.tech',
      deploymentModel: 'SaaS',
      rating: 4.5,
      date: 'december - 15 - 2025'
    },
     {
      logo: '',
      name: 'VisionX', 
      website: 'https://visionx.ai',
      deploymentModel: 'API',
      rating: 4.8,
      date: 'december - 15 - 2025'
    },
  ];

  return (
    <>
      <div className='mainholder'>
        <h1 className="mainheading">Products List</h1>
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Website</th>
              <th>Rating</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={idx}>
                <td>
                    <Image
                      src={product.logo || defaultimage}
                      alt={product.name}
                      width={40}
                      height={40}
                    />
                </td>
                
                <td>{product.name}</td>
                <td>
                    <a href={product.website} target="_blank" rel="noopener noreferrer">
                      Visit
                    </a>
                </td>
                <td>{product.rating}</td>
                <td>{product.date}</td>
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
