import React, { Suspense, useLayoutEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Components/Common/Header';
// import Footer from './Components/Common/Footer';
import NewsDetail from './Components/NewsDetails/NewsDetail';
import QuocTePage from './Containers/QuocTePage';

// Lazy load các container
const HomePage = React.lazy(() => import('./Containers/HomePage'));
const ThoisuPage = React.lazy(() => import('./Containers/ThoiSuPage'));

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
                    <Route path="/thoi-su" element={<ThoisuPage />} />
                    <Route path="/quoc-te" element={<QuocTePage />} />
                    <Route path="/detail-article" element={<NewsDetail/>} />
                </Routes>
            </Suspense>
            {/* <Footer /> */}
        </div>
    );
}

export default App;