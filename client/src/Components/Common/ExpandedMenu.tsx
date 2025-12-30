import React from 'react';
import { Link } from 'react-router-dom';
import MENU_CONFIG from '../../Config/MenuConfig';
import { FaPlayCircle, FaCamera, FaChartBar, FaFileAlt, FaFacebookF, FaYoutube, FaRss, FaTimes } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import './ExpandedMenu.css';

interface ExpandedMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExpandedMenu: React.FC<ExpandedMenuProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        // 1. XÓA onMouseLeave ở đây để không tự tắt khi di chuột ra ngoài
        <div className="expanded-menu-overlay">
            <div className="container">

                <div className="expanded-menu-grid">
                    {/* CỘT TRÁI: DANH SÁCH CHUYÊN MỤC */}
                    <div className="menu-columns">
                        {Object.values(MENU_CONFIG).map((category, index) => {
                            if (category.rssSlug === 'home') return null;
                            const isExternal = category.basePath.startsWith('http');
                            if (category.rssSlug === 'bien-dao' || category.rssSlug === 'khoa-hoc') return null;
                            return (
                                <div key={index} className="menu-group">
                                    {isExternal ? (
                                        <a href={category.basePath} className="menu-group-title" target="_blank" rel="noreferrer">
                                            {category.title}
                                        </a>
                                    ) : (
                                        // Thêm onClick={onClose} để khi bấm vào link thì menu tự tắt
                                        <Link to={category.basePath} className="menu-group-title" onClick={onClose}>
                                            {category.title}
                                        </Link>
                                    )}

                                    <ul className="menu-sub-list">
                                        {category.subMenu.map((sub, subIndex) => {
                                            const isSubExternal = sub.path.startsWith('http');
                                            let linkTo = "";
        
                                            if (isSubExternal) {
                                                linkTo = sub.path; // Link ngoài
                                            } else if (sub.path.startsWith('/')) {
                                                linkTo = sub.path; // Link tuyệt đối (VD: /bien-dao) -> KHÔNG ghép với cha
                                            } else {
                                                linkTo = `${category.basePath}/${sub.path}`; // Link con -> Ghép với cha
                                            }
                                            
                                            return (
                                                <li key={subIndex} className="menu-sub-item">
                                                    {isSubExternal ? (
                                                        <a href={linkTo} className="menu-sub-link" target="_blank" rel="noreferrer">
                                                            {sub.label}
                                                        </a>
                                                    ) : (
                                                        <Link to={linkTo} className="menu-sub-link" onClick={onClose}>
                                                            {sub.label}
                                                        </Link>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    {/* CỘT PHẢI: SIDEBAR TIỆN ÍCH */}
                    <div className="menu-sidebar">
                        <div className="sidebar-buttons">
                            <a href="#" className="sidebar-btn"><FaPlayCircle /> Video</a>
                            <a href="#" className="sidebar-btn"><FaCamera /> Photo</a>
                            <a href="#" className="sidebar-btn"><FaChartBar /> Infographic</a>
                            <a href="#" className="sidebar-btn"><FaFileAlt /> Longform</a>
                        </div>

                        <ul className="sidebar-links">
                            <li className="sidebar-link-item"><a href="#" className="sidebar-text-link">👤 Lý tưởng sống</a></li>
                            <li className="sidebar-link-item"><a href="#" className="sidebar-text-link">⭐ Nói thẳng</a></li>
                            <li className="sidebar-link-item"><a href="#" className="sidebar-text-link">📄 Tin độc quyền</a></li>
                            <li className="sidebar-link-item"><a href="#" className="sidebar-text-link">🌐 Thị trường</a></li>
                            <li className="sidebar-link-item"><a href="#" className="sidebar-text-link">📞 Liên hệ</a></li>
                        </ul>

                        <div className="menu-socials">
                            <a href="#" className="menu-social-icon" style={{background: '#1877f2'}}><FaFacebookF /></a>
                            <a href="#" className="menu-social-icon" style={{background: '#ff0000'}}><FaYoutube /></a>
                            <a href="#" className="menu-social-icon" style={{background: '#0068ff'}}><SiZalo /></a>
                            <a href="#" className="menu-social-icon" style={{background: '#ee802f'}}><FaRss /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpandedMenu;