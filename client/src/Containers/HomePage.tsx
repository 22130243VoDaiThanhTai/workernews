import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataFetch from "../Components/fetchRSS/DataFetch"; 
import './HomePage.css';

const SERVER_LINK = "http://localhost:4000/";

interface RSSContent {
    title: string;
    link: string;
    content: string;       // Chứa HTML ảnh
    contentSnippet?: string; // Đoạn tóm tắt (sapo)
    pubDate?: string;
}

interface NewsItem {
    item: RSSContent;
}

interface HomeRequestPayload {
    signal: "datafetch";
    datapage: string;
}

// Helper: Trích xuất ảnh từ HTML content
const getImgSrc = (content: string | undefined): string => {
    const regex = /<img[^>]+src="([^">]+)"/;
    const match = (content || "").match(regex);
    return match ? match[1] : "https://static.nld.com.vn/image/logo.svg"; 
};

// Helper: Làm sạch đoạn Sapo
const cleanSapo = (sapo: string | undefined): string => {
    if (!sapo) return "";
    return sapo.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 160) + "...";
};

const HomePage = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [tinNong, setTinNong] = useState<NewsItem[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Sử dụng Promise.all để chạy 2 request CÙNG LÚC (Song song)
                const [dataHome, dataHot] = await Promise.all([
                    // Request 1: Tin chính (Trang chủ)
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "home" 
                    }),
                    // Request 2: Tin nóng (Tin mới nhất cho sidebar)
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "home" 
                    })
                ]);

                if (dataHome) setNews(dataHome);
                if (dataHot) setTinNong(dataHot);
                
            } catch (error) { 
                console.error("Lỗi tải trang chủ:", error); 
            }
        };
        loadData();
    }, []);

    // --- PHÂN CHIA DỮ LIỆU ---
   const mainArticle = news[0];             // 1 Bài chính (To nhất - Cột trái trên)
    const middleArticles = news.slice(1, 3); // 2 Bài có ảnh (Xếp dọc - Cột phải trên)
    
    // 3 Bài viết chỉ có chữ, nằm chung 1 hàng dưới cùng
    const bottomRowArticles = news.slice(3, 6); 
    
    const hotNews = tinNong.slice(0, 10);      // Tin nóng Sidebar

    if (news.length === 0) return <div style={{padding:'50px', textAlign:'center'}}>Đang tải dữ liệu...</div>;

    return (
        <div className="home_container">
            <div className="home_fflex">
                
                {/* === KHỐI NỘI DUNG CHÍNH (Bên trái Sidebar) === */}
                <div className="home_fmain">
                    
                    {/* TẦNG TRÊN: BÀI CHÍNH (Trái) + CỘT PHỤ (Phải) */}
                    <div className="home_top_section">
                        
                        {/* Cột Trái: Bài Chính */}
                        <div className="col-large">
                            {mainArticle && (
                                <div className="main-article">
                                    <h1 className="main-title">
                                        <Link to={`/detail-article?link=${encodeURIComponent(mainArticle.item.link)}`}>
                                            {mainArticle.item.title}
                                        </Link>
                                    </h1>
                                    <Link to={`/detail-article?link=${encodeURIComponent(mainArticle.item.link)}`} className="main-thumb">
                                        <img src={getImgSrc(mainArticle.item.content)} alt={mainArticle.item.title} />
                                    </Link>
                                    <p className="main-sapo">
                                        <span className="prefix">(NLĐO) - </span>
                                        {cleanSapo(mainArticle.item.contentSnippet)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Cột Phải (Của khối chính): 2 Bài có ảnh xếp dọc */}
                        <div className="col-middle">
                            {middleArticles.map((item, index) => (
                                <div key={index} className="sub-article">
                                    <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`} className="sub-thumb">
                                        <img src={getImgSrc(item.item.content)} alt={item.item.title} />
                                    </Link>
                                    <h3 className="sub-title">
                                        <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                            {item.item.title}
                                        </Link>
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TẦNG DƯỚI: 3 BÀI VIẾT PHỤ NẰM CHUNG 1 HÀNG NGANG */}
                    <div className="home_bottom_row">
                        {bottomRowArticles.map((item, index) => (
                            <div key={index} className="bottom-item-col">
                                <h3 className="bottom-title">
                                    <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                        {item.item.title}
                                    </Link>
                                </h3>
                                <p className="bottom-sapo">
                                    {cleanSapo(item.item.contentSnippet).replace(/^\(NLĐO\)\s*-\s*/i, '')}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>

                {/* === KHỐI SIDEBAR (Tin Nóng bên phải cùng) === */}
                <div className="home_trending">
                    <div className="sidebar-header">
                        <span className="sidebar-label">TIN NÓNG</span>
                    </div>
                    <div className="sidebar-content">
                        <ul className="list-news-text">
                            {hotNews.map((item, index) => (
                                <li key={index}>
                                    <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                        {item.item.title}
                                    </Link>
                                </li>
                            ))} 
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HomePage;