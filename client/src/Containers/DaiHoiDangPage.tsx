import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DataFetch from "../Components/fetchRSS/DataFetch";
import MENU_CONFIG from '../Config/MenuConfig'; 
import './DaiHoiDangPage.css';

const SERVER_LINK = "http://localhost:4000/";

interface RSSContent {
    title: string;
    link: string;
    content: string;
    contentSnippet?: string;
    pubDate?: string;
}

interface NewsItem {
    item: RSSContent;
}

interface RequestPayload {
    signal: "datafetch";
    datapage: string;
}

// Helpers
const getImgSrc = (content: string | undefined): string => {
    const regex = /<img[^>]+src="([^">]+)"/;
    const match = (content || "").match(regex);
    return match ? match[1] : "https://static.nld.com.vn/image/logo.svg";
};

const cleanSapo = (sapo: string | undefined, limit: number = 200): string => {
    if (!sapo) return "";
    return sapo.replace(/<\/?[^>]+(>|$)/g, "").replace(/^\(NLĐO\)\s*-\s*/i, "").substring(0, limit) + "...";
};

const DaiHoiDangPage = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    

    const configKey = "dai-hoi-dang"; 
    const currentConfig = MENU_CONFIG[configKey];

    useEffect(() => {
        document.body.classList.add('page-dai-hoi-dang');
        return () => {
            document.body.classList.remove('page-dai-hoi-dang');
        };
    }, []);
    
    useEffect(() => {
        const loadData = async () => {
            if (!currentConfig) return; 

            try {
                const data = await DataFetch<NewsItem[], RequestPayload>(SERVER_LINK, { 
                    signal: "datafetch", 
                    datapage: currentConfig.rssSlug 
                });
                
                if (data && Array.isArray(data)) {
                    setNews(data);
                }
            } catch (error) {
                console.error("Lỗi tải trang Đại hội Đảng:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [currentConfig]);

    if (!currentConfig) return <div>Không tìm thấy cấu hình trang Đại hội Đảng</div>;
    if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Đang tải dữ liệu...</div>;

    const [spotlight, ...others] = news;
    const subList = others.slice(0, 3);  
    const tieuDiem = others.slice(3, 8);  

    return (
        <div className="dhd-wrapper">
            <div className="container">

                <div className="dhd-top-bar">
                    <h1 className="dhd-main-title">
                        <Link to={currentConfig.basePath} style={{color: 'inherit', textDecoration: 'none'}}>
                            {currentConfig.title}
                        </Link>
                    </h1>
                    <ul className="dhd-sub-menu">
                        {currentConfig.subMenu.map((item, index) => {
                            
                            const linkTo = item.path.startsWith('http') ? item.path : `${currentConfig.basePath}/${item.path}`;
                            
                            return (
                                <li key={index}>
                                    <Link to={linkTo}>
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="dhd-layout">

                    <div className="dhd-content-main">
                        {spotlight && (
                            <div className="dhd-spotlight">
                                <Link to={`/detail-article?link=${encodeURIComponent(spotlight.item.link)}`} className="thumb">
                                    <img src={getImgSrc(spotlight.item.content)} alt={spotlight.item.title} />
                                </Link>
                                <div className="info">
                                    <h2 className="title">
                                        <Link to={`/detail-article?link=${encodeURIComponent(spotlight.item.link)}`}>
                                            {spotlight.item.title}
                                        </Link>
                                    </h2>
                                    <p className="sapo">{cleanSapo(spotlight.item.contentSnippet)}</p>
                                </div>
                            </div>
                        )}

                        <div className="dhd-list-row">
                            {subList.map((item, index) => (
                                <div key={index} className="dhd-item-col">
                                    <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                        <img src={getImgSrc(item.item.content)} alt={item.item.title} />
                                    </Link>
                                    <h3>
                                        <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                            {item.item.title}
                                        </Link>
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dhd-sidebar">
                        <div className="dhd-sidebar-box">
                            <a href="#" title="Kỷ nguyên mới của dân tộc">
                                <img 
                                    src="https://static.mediacdn.vn/nld.com.vn/images/banner-dhd.jpg" 
                                    alt="Kỷ nguyên mới" 
                                    className="dhd-banner-img"
                                />
                            </a>
                        </div>

                        <div className="dhd-box-tieudiem">
                            <div className="dhd-box-header">
                                <span style={{marginRight:'5px'}}>★</span> TIÊU ĐIỂM
                            </div>
                            <ul className="dhd-sidebar-list">
                                {tieuDiem.map((item, index) => (
                                    <li key={index} className="dhd-sidebar-item">
                                        <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                            <img src={getImgSrc(item.item.content)} alt={item.item.title} />
                                        </Link>
                                        <h4>
                                            <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                                {item.item.title}
                                            </Link>
                                        </h4>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DaiHoiDangPage;