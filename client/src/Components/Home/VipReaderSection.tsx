import React, { useRef, useState, MouseEvent, useEffect } from 'react';
import './VipReaderSection.css';

interface VipSectionProps {
    data: any[];
}

const getImgSrc = (content: string | undefined): string => {
    const regex = /<img[^>]+src="([^">]+)"/;
    const match = (content || "").match(regex);
    return match ? match[1] : "https://static.nld.com.vn/image/logo.svg";
};

const VipReaderSection: React.FC<VipSectionProps> = ({ data }) => {
    const sliderRef = useRef<HTMLDivElement>(null);      
    const scrollbarRef = useRef<HTMLDivElement>(null);   
    const dragRef = useRef<HTMLDivElement>(null);        

    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const updateScrollbar = () => {
        if (!sliderRef.current || !dragRef.current || !scrollbarRef.current) return;

        const container = sliderRef.current;
        const track = scrollbarRef.current;
        const thumb = dragRef.current;

        const contentWidth = container.scrollWidth;
        const visibleWidth = container.clientWidth;

        if (contentWidth <= visibleWidth) {
            thumb.style.width = "100%";
            thumb.style.transform = `translate3d(0px, 0px, 0px)`;
            return;
        }

        const trackWidth = track.clientWidth;
        // Tỷ lệ độ rộng cục trượt
        const thumbWidth = (visibleWidth / contentWidth) * trackWidth;
        thumb.style.width = `${thumbWidth}px`;

        // Tính vị trí trượt
        const maxScrollLeft = contentWidth - visibleWidth; // Quãng đường tối đa cuộn được
        const currentScroll = container.scrollLeft;        // Vị trí hiện tại
        
        // Tỷ lệ đã cuộn (từ 0 đến 1)
        const scrollRatio = currentScroll / maxScrollLeft;

        // Quãng đường tối đa cục trượt có thể đi trong track
        const maxThumbTravel = trackWidth - thumbWidth;
        
        // Vị trí mới của cục trượt
        const thumbPosition = scrollRatio * maxThumbTravel;
        thumb.style.transform = `translate3d(${thumbPosition}px, 0, 0)`;
    };


    useEffect(() => {
        updateScrollbar();
        window.addEventListener('resize', updateScrollbar);
        return () => window.removeEventListener('resize', updateScrollbar);
    }, [data]);


    if (!data || data.length === 0) return null;

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!sliderRef.current) return;
        setIsDown(true);
        sliderRef.current.classList.add('active');
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleMouseLeaveOrUp = () => {
        setIsDown(false);
        if (sliderRef.current) {
            sliderRef.current.classList.remove('active');
        }
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDown || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2; 
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="home-vip-section">
            <div className="vip-container">
                
                <div className="vip-header">
                    <div className="vip-header-left">
                        <h2 className="vip-title">
                            <span className="vip-icon">👑</span>
                            DÀNH CHO BẠN ĐỌC VIP
                        </h2>
                        <span className="vip-note">Chuyên mục báo chí đặc biệt, có thu phí</span>
                    </div>
                    <a href="#" className="btn-reg-vip">Đăng ký bạn đọc VIP</a>
                </div>

                <div className="vip-list-wrapper">
                    <div 
                        className="vip-list-scroll" 
                        ref={sliderRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeaveOrUp}
                        onMouseUp={handleMouseLeaveOrUp}
                        onMouseMove={handleMouseMove}
                        onScroll={updateScrollbar} 
                    >
                        {data.map((item, index) => (
                            <div key={index} className="vip-item">
                                <a href="#" className="vip-thumb" onClick={(e) => e.preventDefault()}> 
                                    <img 
                                        src={getImgSrc(item.item.content)} 
                                        alt={item.item.title} 
                                        loading="lazy" 
                                        draggable="false" 
                                    />
                                </a>
                                <h3 className="vip-item-title">
                                    <a href="#" onClick={(e) => e.preventDefault()}>{item.item.title}</a>
                                </h3>
                            </div>
                        ))}
                    </div>
                    
                    {/* THANH SCROLLBAR */}
                    <div className="swiper-scrollbar swiper-scrollbar-horizontal" ref={scrollbarRef}>
                        <div className="swiper-scrollbar-drag" ref={dragRef}></div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default VipReaderSection;