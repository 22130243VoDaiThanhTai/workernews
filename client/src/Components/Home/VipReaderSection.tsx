import React, { useRef, useState, MouseEvent } from 'react';
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
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    if (!data || data.length === 0) return null;

    // Khi nhấn chuột 
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!sliderRef.current) return;
        setIsDown(true);
        sliderRef.current.classList.add('active'); // Thêm class để đổi con trỏ chuột
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    // Khi chuột rời khỏi khu vực hoặc thả chuột ra
    const handleMouseLeaveOrUp = () => {
        setIsDown(false);
        if (sliderRef.current) {
            sliderRef.current.classList.remove('active');
        }
    };

    // Khi di chuyển chuột (kéo)
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
                </div>

            </div>
        </div>
    );
};

export default VipReaderSection;