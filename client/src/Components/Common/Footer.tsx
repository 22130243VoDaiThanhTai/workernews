import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="nld-ft-wrapper">
            <div className="nld-ft-container">

                <div className="nld-ft-header">
                    <div className="nld-ft-brand">
                        <Link to="/" className="nld-footer-logo">
                            <img src="https://i.ibb.co/TxV1Pb1D/logo-nld.png" alt="Báo Người Lao Động" />
                        </Link>
                    </div>
                    <div className="nld-ft-nav">
                        <Link to="/thoi-su">Thời sự</Link>
                        <Link to="/quoc-te">Quốc tế</Link>
                        <Link to="/lao-dong">Lao động</Link>
                        <Link to="/ban-doc">Bạn đọc</Link>
                        <Link to="/kinh-te">Kinh tế</Link>
                        <Link to="/suc-khoe">Sức khỏe</Link>
                        <Link to="/giao-duc">Giáo dục</Link>
                        <Link to="/phap-luat">Pháp luật</Link>
                        <Link to="/van-hoa-van-nghe">Văn hóa - Văn nghệ</Link>
                        <Link to="/giai-tri">Giải trí</Link>
                        <Link to="/the-thao">Thể thao</Link>
                        <Link to="/ai-365">AI 365</Link>
                        <a href="https://phunu.nld.com.vn" target="_blank" rel="noopener noreferrer">
                            Phụ nữ
                        </a>
                        <Link to="/gia-dinh">Gia đình</Link>
                        <a href="https://diaoc.nld.com.vn" target="_blank" rel="noopener noreferrer" >
                            Địa ốc
                        </a>
                    </div>
                </div>

                <div className="nld-ft-divider"></div>

                <div className="nld-ft-body">

                    <div className="nld-ft-col nld-ft-col-1">
                        <h3 className="nld-ft-heading">BÁO NGƯỜI LAO ĐỘNG ĐIỆN TỬ</h3>
                        <p>Cơ quan chủ quản: <strong>Thành ủy Thành phố Hồ Chí Minh</strong></p>
                        <p>© Giấy phép số 115/GP- BTTTT cấp ngày 09.02.2021</p>
                        <p><strong>Tổng Biên tập:</strong> Lê Văn A</p>
                        <p><strong>Phó Tổng Biên tập:</strong> Lê Văn B, TRẦN VĂN A, LÊ CAO C</p>
                        <p><strong>Tổng TKTS:</strong> NGUYỄN TỐ A</p>
                    </div>

                    <div className="nld-ft-col nld-ft-col-2">
                        <h3 className="nld-ft-heading">TRỤ SỞ CHÍNH</h3>
                        <p>127 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TPHCM</p>
                        <p>Điện thoại: <strong>028-1234.4321</strong> / <strong>028-1234.5678</strong></p>
                        <p>Fax: 028-3333.3333</p>
                        
                        <h3 className="nld-ft-heading mt-20">LIÊN HỆ QUẢNG CÁO</h3>
                        <p><strong>LIÊN HỆ QUẢNG CÁO BÁO ĐIỆN TỬ</strong></p>
                        <p>Email: <strong>lienhequangbadoanhnghiep@gmail.com</strong></p>
                        <p>Điện thoại: <strong>0988333333</strong></p>
                    </div>

                    <div className="nld-ft-col nld-ft-col-3">
                        <h3 className="nld-ft-heading">THEO DÕI CHÚNG TÔI</h3>
                        <div className="nld-ft-socials">    
                            <a href="https://www.facebook.com/nguoilaodong" className="nld-social-btn fb" rel="nofollow" target="_blank">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.12 6.04V8.51H15.01C13.77 8.51 13.38 9.28 13.38 10.07V12.06H16.16L15.72 14.96H13.38V21.96C18.16 21.21 21.82 17.06 21.82 12.06C21.82 6.53 17.32 2.04 12 2.04Z"/></svg>
                            </a>
                            <a href="https://www.youtube.com/channel/UCzkyOx_0O1pGOqHiUMOe2KQ" className="nld-social-btn yt" rel="nofollow" target="_blank">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                            </a>
                            <a href="https://zalo.me/4417973660626754335" className="nld-social-btn zl" rel="nofollow" target="_blank">
                                <span style={{fontWeight:'bold', fontSize:12}}>Zalo</span>
                            </a>
                            <a href="https://nld.com.vn/rss.htm" className="nld-social-btn rss" rel="nofollow" target="_blank">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93v-2.83Z"/></svg>
                            </a>
                        </div>

                        <h3 className="nld-ft-heading mt-20">TẢI ỨNG DỤNG ĐỌC BÁO</h3>
                        <div className="nld-ft-apps">
                            <img src="https://static.mediacdn.vn/nld.com.vn/image/icon-app-store.svg" alt="App Store" />
                            <img src="https://static.mediacdn.vn/nld.com.vn/image/icon-google-play.svg" alt="Google Play" />
                        </div>
                    </div>
                </div>

                <div className="nld-ft-copyright">
                    <p>Bản quyền thuộc về Báo Người Lao Động. Các website khác đã được chúng tôi đồng ý cho khai thác thông tin, khi đăng lại phải ghi rõ nguồn: Theo Báo Người Lao Động (www.nld.com.vn).</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;