import React, { Suspense, useLayoutEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Components/Common/Header';
// import Footer from './Components/Common/Footer';
import NewsDetail from './Components/NewsDetails/NewsDetail';
import ScrollToTop from './Components/Common/ScrollToTop';
// Lazy load các container
const HomePage = React.lazy(() => import('./Containers/HomePage'));

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

                // Nếu là link báo và không phải link nội bộ -> Chặn lại và chuyển hướng
                if (isNewsLink && !isInternalLink) { 
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

                    {/* /thoi-su, /quoc-te, /khoa-hoc, /bien-dao */}
                    <Route path="/:mainCategory" element={<MasterPage />} />

                    {/*/thoi-su/chinh-tri, /quoc-te/nguoi-viet-do-day, /quoc-te/hay-la */}
                    <Route path="/:mainCategory/:subCategory" element={<MasterPage />} />

                </Routes>
            </Suspense>
            <ScrollToTop />
            {/* <Footer /> */}
        </div>
    );
}

export default App;