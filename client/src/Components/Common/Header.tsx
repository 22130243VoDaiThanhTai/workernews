import React, { useState, useEffect } from "react";
import { FaHome, FaSearch, FaUserCircle, FaFacebook, FaYoutube, FaRss, FaEllipsisH } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {
    const date: Date = new Date();
    const daysOfWeek: string[] = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    const dateString: string = `${daysOfWeek[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const location = useLocation();
    
    // --- LOGIC STICKY MENU ---
    // Khai báo rõ kiểu dữ liệu là boolean cho state
    const [isSticky, setIsSticky] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = (): void => {
            // Khi kéo xuống quá 120px thì ghim menu
            if (window.scrollY > 120) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        
        // Cleanup function
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    // -------------------------

    return (
        <header className="header">
            {/* 1. TOP BAR */}
            <div className="header-top-bar">
                <div className="container top-bar-flex">
                    <div className="top-left">
                        <span>HOTLINE: 0903.343.439 - 0819.123.127</span>
                        <span className="sep">|</span>
                        <a href="#" className="highlight-link">ĐẶT MUA BÁO</a>
                    </div>
                    <div className="top-right">
                        <a href="#" className="top-link"><span className="icon-prefix">👤</span> Lý tưởng sống</a>
                        <a href="#" className="top-link"><span className="icon-prefix">⭐</span> Nói thẳng</a>
                        <a href="#" className="top-link"><span className="icon-prefix">📄</span> Tin độc quyền</a>
                        <a href="#" className="top-link"><span className="icon-prefix">🌐</span> Thị trường</a>
                        <a href="#" className="top-link"><span className="icon-prefix">🔔</span> 24h qua</a>
                        <div className="social-icons">
                            <a href="#" className="social-icon fb"><FaFacebook /></a>
                            <a href="#" className="social-icon yt"><FaYoutube /></a>
                            <a href="#" className="social-icon zalo"><SiZalo /></a>
                            <a href="#" className="social-icon rss"><FaRss /></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN HEADER */}
            <div className="header-main">
                <div className="container header-main-flex">
                    <div className="brand-section">
                        <Link to="/" className="logo-link">
                            <img src="https://i.ibb.co/TxV1Pb1D/logo-nld.png" alt="Người Lao Động" className="main-logo"/>
                        </Link>
                        <div className="brand-divider"></div>
                        <a href="#" className="logo-link">
                            <img src="https://i.ibb.co/GvxbcGvT/Logoenglish.png" alt="NLD English" className="sub-logo"/>
                        </a>
                        <div className="brand-divider"></div>
                        <span className="current-date">{dateString}</span>
                    </div>

                    <div className="search-section">
                        <div className="input-group">
                            <input type="text" placeholder="Tìm kiếm..." />
                            <button><FaSearch /></button>
                        </div>
                    </div>

                    <div className="actions-section">
                        <a href="#" className="user-icon"><FaUserCircle size={32} color="#999"/></a>
                        <a href="#" className="btn-vip">Đăng ký gói bạn đọc VIP</a>
                        <a href="#" className="btn-epaper">E-paper</a>
                    </div>
                </div>
            </div>

            {/* 3. MENU ĐIỀU HƯỚNG */}
            <div className="nav-placeholder" style={{ height: isSticky ? '42px' : '0px' }}></div>
            
            <div className={`header-nav-wrapper ${isSticky ? 'sticky' : ''}`}>
                <div className="header-nav">
                    <div className="container-fluid">
                        <ul className="nav-menu">
                            <li><Link to="/" className={`nav-item home-icon ${location.pathname === '/' ? 'active' : ''}`}><FaHome size={17} /></Link></li>
                            <li><Link to="/thoi-su" className="nav-item">THỜI SỰ</Link></li>
                            <li><Link to="/quoc-te" className="nav-item">QUỐC TẾ</Link></li>
                            <li><Link to="/lao-dong" className="nav-item">LAO ĐỘNG</Link></li>
                            <li><Link to="/ban-doc" className="nav-item">BẠN ĐỌC</Link></li>
                            <li><Link to="/net-zero" className="nav-item">NET ZERO</Link></li>
                            <li><Link to="/kinh-te" className="nav-item">KINH TẾ</Link></li>
                            <li><Link to="/suc-khoe" className="nav-item">SỨC KHỎE</Link></li>
                            <li><Link to="/giao-duc" className="nav-item">GIÁO DỤC</Link></li>
                            <li><Link to="/phap-luat" className="nav-item">PHÁP LUẬT</Link></li>
                            <li><Link to="/van-hoa-van-nghe" className="nav-item">VĂN HÓA - VĂN NGHỆ</Link></li>
                            <li><Link to="/giai-tri" className="nav-item">GIẢI TRÍ</Link></li>
                            <li><Link to="/the-thao" className="nav-item">THỂ THAO</Link></li>
                            <li><Link to="/ai-365" className="nav-item">AI 365</Link></li>
                            <li>
                                <a 
                                    href="https://phunu.nld.com.vn" 
                                    className="nav-item" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    PHỤ NỮ
                                </a>
                            </li>
          
                            <li><Link to="/gia-dinh" className="nav-item">GIA ĐÌNH</Link></li>
                            <li>
                                <a 
                                    href="https://diaoc.nld.com.vn" 
                                    className="nav-item" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    ĐỊA ỐC
                                </a>
                            </li>
                            <li><a href="#" className="nav-item dots"><FaEllipsisH /></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;