// src/components/BackToTopButton.js
import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const BackToTopButton = () => {
    //usestate variable for conditional rendering of the back to top button
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Show button when page is scrolled down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll back to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Determine button position based on current page
  const isCaseDetailsPage = location.pathname === '/case-details/:id'; // Adjust this path as needed

  //conditional rendering of the back to top button
  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className={`fixed ${isCaseDetailsPage ? 'bottom-40' : 'bottom-8'} right-4 p-3 rounded-full bg-cyberGreen text-darkBlue hover:bg-darkBlue hover:text-cyberGreen shadow-lg transition duration-300`}
      >
        <FiArrowUp size={24} />
      </button>
    )
  );
};

export default BackToTopButton;
