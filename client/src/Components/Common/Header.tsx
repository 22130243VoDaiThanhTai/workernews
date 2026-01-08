import React, { useState, useEffect } from "react";
import { FaHome, FaSearch, FaUserCircle, FaFacebook, FaYoutube, FaRss, FaEllipsisH, FaTimes } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import ExpandedMenu from "./ExpandedMenu";

function Header() {
    const date: Date = new Date();
    const daysOfWeek: string[] = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    const dateString: string = `${daysOfWeek[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const location = useLocation();

    // --- LOGIC STICKY MENU ---
    const [isSticky, setIsSticky] = useState<boolean>(false);
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const handleScroll = (): void => {
            if (window.scrollY > 120) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = (): void => {
            if (window.scrollY > 120) setIsSticky(true);
            else setIsSticky(false);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path: string) => {

        if (path === '/') {
            return location.pathname === '/' ? 'active' : '';
        }

        if (location.pathname === path || location.pathname.startsWith(path + '/')) {
            return 'active';
        }

        return '';
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.preventDefault(); // Chặn link # mặc định
        setIsMenuOpen(!isMenuOpen);
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
    }
    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        setShowUserMenu(false);
        window.location.reload(); // ép Header render lại
    };

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
                        <Link to="/" className="logo-link" onClick={closeMenu}>
                            <img src="https://i.ibb.co/TxV1Pb1D/logo-nld.png" alt="Người Lao Động" className="main-logo"/>
                        </Link>
                        <div className="brand-divider"></div>
                        <a href="#" className="logo-link" onClick={closeMenu}>
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
                        <div className="user-dropdown">
                            {currentUser ? (
                                <span className="user-name">
                                    {currentUser.username}
                                </span>
                            ) : (
                                <span className="user-icon">
                                    <FaUserCircle size={32} color="#999" />
                                </span>
                            )}

                            <div className="user-menu">
                                {currentUser ? (
                                    <button onClick={handleLogout}>Đăng xuất</button>
                                ) : (
                                    <>
                                        <Link to="/login" className="menu-link">Đăng nhập</Link>
                                        <Link to="/register" className="menu-link">Đăng ký</Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <a href="#" className="btn-vip">Đăng ký gói bạn đọc VIP</a>
                        <a href="#" className="btn-epaper">E-paper</a>
                    </div>
                </div>
            </div>

            {/* 3. MENU ĐIỀU HƯỚNG */}
            <div className="nav-placeholder" style={{ height: isSticky ? '42px' : '0px' }}></div>

            <div className={`header-nav-wrapper ${isSticky ? 'sticky' : ''}`}>
                <div className="header-nav">
                    <div className="container-fluid" style={{position: 'relative'}}>
                        <ul className="nav-menu">
                            <li><Link to="/" className={`nav-item home-icon ${isActive('/')}`} onClick={closeMenu}><FaHome size={17} /></Link></li>
                            <li><Link to="/thoi-su" className={`nav-item ${isActive('/thoi-su')}`} onClick={closeMenu}>THỜI SỰ</Link></li>
                            <li><Link to="/quoc-te" className={`nav-item ${isActive('/quoc-te')}`} onClick={closeMenu}>QUỐC TẾ</Link></li>
                            <li><Link to="/lao-dong" className={`nav-item ${isActive('/lao-dong')}`} onClick={closeMenu}>LAO ĐỘNG</Link></li>
                            <li><Link to="/ban-doc" className={`nav-item ${isActive('/ban-doc')}`} onClick={closeMenu}>BẠN ĐỌC</Link></li>
                            <li><Link to="/net-zero" className={`nav-item ${isActive('/net-zero')}`} onClick={closeMenu}>NET ZERO</Link></li>
                            <li><Link to="/kinh-te" className={`nav-item ${isActive('/kinh-te')}`} onClick={closeMenu}>KINH TẾ</Link></li>
                            <li><Link to="/suc-khoe" className={`nav-item ${isActive('/suc-khoe')}`} onClick={closeMenu}>SỨC KHỎE</Link></li>
                            <li><Link to="/giao-duc" className={`nav-item ${isActive('/giao-duc')}`} onClick={closeMenu}>GIÁO DỤC</Link></li>
                            <li><Link to="/phap-luat" className={`nav-item ${isActive('/phap-luat')}`} onClick={closeMenu}>PHÁP LUẬT</Link></li>
                            <li><Link to="/van-hoa-van-nghe" className={`nav-item ${isActive('/van-hoa-van-nghe')}`} onClick={closeMenu}>VĂN HÓA - VĂN NGHỆ</Link></li>
                            <li><Link to="/giai-tri" className={`nav-item ${isActive('/giai-tri')}`} onClick={closeMenu}>GIẢI TRÍ</Link></li>
                            <li><Link to="/the-thao" className={`nav-item ${isActive('/the-thao')}`} onClick={closeMenu}>THỂ THAO</Link></li>
                            <li><Link to="/ai-365" className={`nav-item ${isActive('/ai-365')}`} onClick={closeMenu}>AI 365</Link></li>
                            <li>
                                <a href="https://phunu.nld.com.vn" className="nav-item" target="_blank" rel="noopener noreferrer">
                                    PHỤ NỮ
                                </a>
                            </li>
                            <li><Link to="/gia-dinh" className={`nav-item ${isActive('/gia-dinh')}`} onClick={closeMenu}>GIA ĐÌNH</Link></li>
                            <li>
                                <a href="https://diaoc.nld.com.vn" className="nav-item" target="_blank" rel="noopener noreferrer">
                                    ĐỊA ỐC
                                </a>
                            </li>
                            <li>
                                <a href="#" className={`nav-item dots ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                                    {/* Nếu menu mở thì hiện icon X (FaTimes), nếu đóng thì hiện 3 chấm */}
                                    {isMenuOpen ? <FaTimes size={16} /> : <FaEllipsisH size={16} />}
                                </a>
                            </li>
                        </ul>
                        <ExpandedMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;