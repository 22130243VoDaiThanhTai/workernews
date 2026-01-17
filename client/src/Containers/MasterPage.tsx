import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import DataFetch from '../Components/fetchRSS/DataFetch';
import './Page.css';
import UniversalSidebar from '../Components/Sidebar/GeneralSidebar';
import MENU_CONFIG from '../Config/MenuConfig';
import ArticleCard from "../Components/FavoriteNews/ArticleCard";

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

    const safeConfig = MENU_CONFIG || {};
    const currentConfig = safeConfig[configKey || "home"];
    const currentTopic = subCategory || (currentConfig ? currentConfig.rssSlug : "home");

    const [articles, setArticles] = useState<RSSContent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [visibleCount, setVisibleCount] = useState<number>(12);

    // --- GIỮ MÀU ĐỎ CHO BODY KHI Ở TRANG CON ---
    useEffect(() => {
        if (configKey === 'dai-hoi-dang') {
            document.body.classList.add('page-dai-hoi-dang');
        } else {
            document.body.classList.remove('page-dai-hoi-dang');
        }
        return () => {
            document.body.classList.remove('page-dai-hoi-dang');
        };
    }, [configKey]);

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
    
    // Hàm check active cho menu thường
    const getActiveClass = (path: string) => {
        if (path === subCategory) return "active-link";
        if (path.startsWith('/') && location.pathname.includes(path)) return "active-link";
        return "";
    };

    useEffect(() => {
        if (currentConfig) {
            let pageTitle = currentConfig.title;
            if (subCategory) {
                const subItem = currentConfig.subMenu.find(item => item.path === subCategory);
                if (subItem) pageTitle = subItem.label; 
            }
            document.title = `${pageTitle} | Báo Người Lao Động`;
        }
        return () => { document.title = "Báo Người Lao Động"; };
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

    if (!currentConfig) {
        return <div style={{padding: 50, textAlign: 'center'}}>Không tìm thấy trang này (404)</div>;
    }

    const heroArticle = articles[0];
    const subFeatured = articles.slice(1, 4);
    const listArticlesFull = articles.slice(4);
    const listArticlesVisible = listArticlesFull.slice(0, visibleCount);

    return (
        <div className={`thoisu-container ${configKey === 'dai-hoi-dang' ? 'dhd-master-layout' : ''}`}>
            
            {/* ---  XỬ LÝ HEADER RIÊNG BIỆT --- */}
            {configKey === 'dai-hoi-dang' ? (
                // ===  GIAO DIỆN HEADER CHO ĐẠI HỘI ĐẢNG (MÀU ĐỎ, FONT SERIF) ===
                <div className="dhd-top-bar" style={{
                    borderBottom: '1px solid #ddd', 
                    marginBottom: '20px', 

                    display: 'flex', 
                    alignItems: 'baseline',
                    flexWrap: 'wrap'
                }}>
                     <h1 className="dhd-main-title" style={{
                         fontFamily: '"Merriweather", serif', 
                         fontSize: '34px', 
                         fontWeight: '700', 
                         color: '#d71920',
                         margin: '0 30px 0 0', 
                         lineHeight: '1'
                     }}>
                        <Link to="/dai-hoi-dang" style={{color: 'inherit', textDecoration: 'none'}}>
                            {currentConfig.title}
                        </Link>
                     </h1>
                     <ul className="dhd-sub-menu" style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                        {currentConfig.subMenu.map((item, idx) => {
                             // Logic active riêng cho menu DHD
                             const isActive = subCategory === item.path || location.pathname.includes(item.path);
                             const linkTo = `/${currentConfig.rssSlug}/${item.path}`;
                             
                             return (
                                 <li key={idx}>
                                     <Link 
                                        to={linkTo} 
                                        style={{
                                            textDecoration: 'none', 
                                            color: isActive ? '#d71920' : '#333', 
                                            fontWeight: isActive ? '700' : '500', 
                                            fontSize: '15px',
                                            fontFamily: 'Arial, sans-serif'
                                        }}
                                     >
                                         {item.label}
                                     </Link>
                                 </li>
                             );
                        })}
                     </ul>
                </div>
            ) : (
                // ===  GIAO DIỆN HEADER CHO CÁC TRANG THƯỜNG (THỜI SỰ, KINH TẾ...) ===
                <div className="section-header">
                    <h2 className="section-title">
                        <Link to={currentConfig.basePath} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {currentConfig.title}
                        </Link>
                    </h2>
                    {currentConfig.subMenu.length > 0 && (
                        <div className="sub-nav">
                            {currentConfig.subMenu.map((item, idx) => {
                                const isExternal = item.path.startsWith('https');
                                if (isExternal) {
                                    return (
                                        <a key={idx} href={item.path} target="_blank" rel="noopener noreferrer" 
                                           style={{ textDecoration: 'none', fontFamily: 'Roboto, sans-serif', color: '#666', fontSize: '15px', fontWeight: 600, paddingBottom: '5px' }}>
                                            {item.label}
                                        </a>
                                    );
                                }
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
            )}

            {/* --- PHẦN NỘI DUNG BÀI VIẾT (GIỮ NGUYÊN) --- */}
            {loading ? <div style={{textAlign:'center', padding:'50px'}}>Đang tải tin...</div> : (
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
                                    <ArticleCard
                                        key={index}
                                        article={{
                                            id: item.link,
                                            title: item.title,
                                            link: item.link,
                                            image: extractImage(item),
                                            sapo: cleanDescription(item.description || item.contentSnippet)
                                                .replace(/^(.*?) - /, ''),
                                            pubDate: new Date(item.pubDate).toLocaleString('vi-VN'),
                                            detailLink: getDetailLink(item.link)
                                        }}
                                    />
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