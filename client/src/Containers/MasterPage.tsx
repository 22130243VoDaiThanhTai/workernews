import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import DataFetch from '../Components/fetchRSS/DataFetch';
import './Page.css';
import UniversalSidebar from '../Components/Sidebar/GeneralSidebar';

import MENU_CONFIG from '../Config/MenuConfig'; 

const SERVER_LINK = "http://localhost:4000/";

interface RSSContent { title: string; link: string; description?: string; content?: string; contentSnippet?: string; enclosure?: { url: string }; pubDate: string; }
interface NewsItem { item: RSSContent; }

function MasterPage() {
    const { mainCategory, subCategory } = useParams();
    const location = useLocation();

    // lấy configKey
    let configKey = mainCategory;
    if (!configKey) {
         configKey = location.pathname.split('/')[1]; 
    }

    // nếu MENU_CONFIG bị lỗi thì fallback về object rỗng để không sập web
    const safeConfig = MENU_CONFIG || {};
    const currentConfig = safeConfig[configKey || "home"];

    // xác định Topic RSS
    const currentTopic = subCategory || (currentConfig ? currentConfig.rssSlug : "home");

    const [articles, setArticles] = useState<RSSContent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [visibleCount, setVisibleCount] = useState<number>(12);

    const extractImage = (item: RSSContent): string => { 
        if (item.enclosure && item.enclosure.url) return item.enclosure.url;
        const imgRegex = /<img.*?src="(.*?)"/;
        const contentToCheck = item.content || item.description || "";
        const match = contentToCheck.match(imgRegex);
        return match && match[1] ? match[1] : "https://static-images.vnncdn.net/files/publish/2022/10/22/nld-logo-1065.jpg";
    };
    const cleanDescription = (html: string | undefined): string => {
        if (!html) return "";
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };
    const getDetailLink = (url: string) => `/detail-article?link=${encodeURIComponent(url)}`;
    const handleLoadMore = () => setVisibleCount(prev => prev + 9);
    
    const getActiveClass = (path: string) => {
        if (path === subCategory) return "active-link";
        if (path.startsWith('/') && location.pathname.includes(path)) return "active-link";
        return "";
    };

    useEffect(() => {
        if (currentConfig) {
            // 1. Mặc định lấy tên danh mục cha (VD: Thời sự)
            let pageTitle = currentConfig.title;

            // 2. Nếu đang xem mục con (có subCategory), hãy tìm tên hiển thị của nó
            if (subCategory) {
                const subItem = currentConfig.subMenu.find(item => item.path === subCategory);
                
                // Nếu tìm thấy, lấy tên mục con (VD: Chính trị)
                if (subItem) {
                    pageTitle = subItem.label; 
                }
            }
            document.title = `${pageTitle} | Báo Người Lao Động`;
        }
        
        return () => {
            document.title = "Báo Người Lao Động";
        };

    }, [currentConfig, subCategory]);

    useEffect(() => {
        const fetchData = async () => {
            if(!currentConfig) return; 
            setLoading(true);
            setArticles([]);
            try {
                const response = await DataFetch<NewsItem[], {signal:string, datapage:string}>(SERVER_LINK, {
                    signal: "datafetch",
                    datapage: currentTopic
                });
                if (response && Array.isArray(response)) setArticles(response.map(entry => entry.item));
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchData();
    }, [currentTopic, currentConfig]);

    // Nếu không tìm thấy config -> Hiện thông báo lỗi
    if (!currentConfig) {
        console.error("Không tìm thấy config cho:", configKey);
        console.log("Danh sách config hiện có:", Object.keys(safeConfig));
        return <div style={{padding: 50, textAlign: 'center'}}>Không tìm thấy trang này (404)</div>;
    }

    const heroArticle = articles[0];
    const subFeatured = articles.slice(1, 4);
    const listArticlesFull = articles.slice(4);
    const listArticlesVisible = listArticlesFull.slice(0, visibleCount);

    return (
        <div className="thoisu-container">
            <div className="section-header">
                <h2 className="section-title">
                    <Link to={currentConfig.basePath} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {currentConfig.title}
                    </Link>
                </h2>
                {currentConfig.subMenu.length > 0 && (
                    <div className="sub-nav">
                        {currentConfig.subMenu.map((item, idx) => {
                            const linkTo = item.path.startsWith('/') ? item.path : `${currentConfig.basePath}/${item.path}`;
                            return (
                                <Link key={idx} to={linkTo} className={getActiveClass(item.path)}>
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            {loading ? <div style={{textAlign:'center', padding:'50px'}}>Đang tải tin {currentConfig.title}...</div> : (
                <>
                    {heroArticle && (
                         <div className="hero-wrapper">
                            <div className="hero-image">
                                <Link to={getDetailLink(heroArticle.link)}><img src={extractImage(heroArticle)} alt={heroArticle.title} /></Link>
                            </div>
                            <div className="hero-info">
                                <h3><Link to={getDetailLink(heroArticle.link)}>{heroArticle.title}</Link></h3>
                                <p>{cleanDescription(heroArticle.description || heroArticle.contentSnippet).replace(/^(.*?) - /, '')}</p>
                            </div>
                        </div>
                    )}

                    <div className="sub-featured-grid">
                        {subFeatured.map((item, index) => (
                            <div key={index} className="sub-card">
                                <Link to={getDetailLink(item.link)} className="sub-img-link"><img src={extractImage(item)} alt={item.title} /></Link>
                                <h4><Link to={getDetailLink(item.link)}>{item.title}</Link></h4>
                            </div>
                        ))}
                    </div>

                    <div className="divider-line"></div>

                    <div className="thoisu-body-flex">
                        <div className="main-column">
                            <div className="news-list">
                                {listArticlesVisible.map((item, index) => (
                                    <div key={index} className="news-item">
                                        <div className="news-thumb"><Link to={getDetailLink(item.link)}><img src={extractImage(item)} alt={item.title} /></Link></div>
                                        <div className="news-content">
                                            <h3 className="news-title"><Link to={getDetailLink(item.link)}>{item.title}</Link></h3>
                                            <p className="news-sapo">{cleanDescription(item.description || item.contentSnippet).replace(/^(.*?) - /, '')}</p>
                                            <div className="news-meta"><span>{new Date(item.pubDate).toLocaleString('vi-VN')}</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             {visibleCount < listArticlesFull.length && (
                                <div className="load-more-container">
                                    <button onClick={handleLoadMore} className="btn-load-more">XEM THÊM</button>
                                </div>
                            )}
                        </div>

                        {currentConfig.sidebarWidgets.length > 0 && (
                            <div className="right-sidebar">
                                <UniversalSidebar widgets={currentConfig.sidebarWidgets} basePath={currentConfig.basePath} />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default MasterPage;