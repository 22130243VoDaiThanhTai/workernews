import React, { useState, useEffect } from 'react';
import './ScrollToTop.css'; 

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Hàm kiểm tra vị trí cuộn để hiện/ẩn nút
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Hàm cuộn lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`} onClick={scrollToTop}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6"/>
            </svg>
            <span>TOP</span>
        </div>
    );
};

export default ScrollToTop;