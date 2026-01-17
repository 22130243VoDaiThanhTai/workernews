import React, { Suspense, useLayoutEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Components/Common/Header';
import Footer from './Components/Common/Footer';
import NewsDetail from './Components/NewsDetails/NewsDetail';
import ScrollToTop from './Components/Common/ScrollToTop';
import LoginPage from "./Containers/LoginPage";
import RegisterPage from "./Containers/RegisterPage";
// Lazy load các container
const HomePage = React.lazy(() => import('./Containers/HomePage'));
const DaiHoiDangPage = React.lazy(() => import('./Containers/DaiHoiDangPage'));
// IMPORT MASTER PAGE (Thay thế cho ThoiSuPage, QuocTePage...)
const MasterPage = React.lazy(() => import('./Containers/MasterPage'));


function App() {
    const navigate = useNavigate();

    useLayoutEffect(() => {
        const handleLinkClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target) return;
            const link = target.closest('a') as HTMLAnchorElement;
            
            if (link && link.href && !link.href.includes("facebook") && !link.href.includes("zalo")) {
                const isInternalLink = link.href.includes("localhost") || link.href.includes("detail-article");
                const isNewsLink = link.href.includes(".htm") || link.href.includes("nld.com.vn");
                
                //Thêm trường hợp trang mai vàng
                //const isMaiVang = link.href.includes("maivang.nld.com.vn");
                const isExternalSubdomain = 
                    link.href.includes("maivang.nld.com.vn") || 
                    link.href.includes("phunu.nld.com.vn") || 
                    link.href.includes("thitruong.nld.com.vn") || 
                    link.href.includes("diaoc.nld.com.vn");
                // Nếu là link báo và không phải link nội bộ -> Chặn lại và chuyển hướng
                if (isNewsLink && !isInternalLink && !isExternalSubdomain) { 
                      event.preventDefault();
                      navigate(`/detail-article?link=${encodeURIComponent(link.href)}`);
                }
            }
        };

        document.addEventListener('click', handleLinkClick);
        return () => { document.removeEventListener('click', handleLinkClick); };
    }, [navigate]);
  
    return (
        <div>
            <Header />
            <Suspense fallback={<div style={{padding:'20px', textAlign:'center'}}>Đang tải...</div>}>
                <Routes>

                    <Route path="/" element={<HomePage />} />

                    <Route path="/detail-article" element={<NewsDetail/>} />
                    <Route path="/dai-hoi-dang" element={<DaiHoiDangPage />} />
                    <Route path="/dong-su-kien/:slug" element={<MasterPage />} />
                    <Route path="/:mainCategory" element={<MasterPage />} />

                    {/*/thoi-su/chinh-tri, /quoc-te/nguoi-viet-do-day, /quoc-te/hay-la */}
                    <Route path="/:mainCategory/:subCategory" element={<MasterPage />} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                </Routes>
            </Suspense>
            <ScrollToTop />
            <Footer />
        </div>
    );
}

export default App;