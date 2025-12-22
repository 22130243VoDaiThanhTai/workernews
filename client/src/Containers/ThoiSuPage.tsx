import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom'; 
import DataFetch from '../Components/fetchRSS/DataFetch';
import './Page.css';
import Sidebar from '../Components/Slidebar/Slidebar';

const SERVER_LINK = "http://localhost:4000/";
 
interface RSSContent {
    title: string;
    link: string;
    description?: string;
    content?: string;
    contentSnippet?: string;
    enclosure?: { url: string }; 
    pubDate: string;
}
 
interface NewsItem {
    item: RSSContent;
}
 
interface ThoiSuPayload {
    signal: "datafetch";
    datapage: string;
}

function ThoiSuPage() {
    const { subCategory } = useParams();
    const location = useLocation(); 

    const isBienDao = location.pathname.includes('/bien-dao');

    // Xác định chủ đề (topic) để gửi lên Server
    // Nếu là Biển đảo -> dùng "bien-dao", ngược lại dùng subCategory hoặc "thoi-su"
    const currentTopic = isBienDao ? "bien-dao" : (subCategory || "thoi-su");

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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setArticles([]); 
            try {
                const response = await DataFetch<NewsItem[], ThoiSuPayload>(SERVER_LINK, {
                    signal: "datafetch",
                    datapage: currentTopic 
                });
                if (response && Array.isArray(response)) {
                    setArticles(response.map(entry => entry.item));
                }
            } catch (error) {
                console.error("Lỗi tải trang:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentTopic]);

    const handleLoadMore = () => setVisibleCount(prev => prev + 9);
    const getDetailLink = (url: string) => `/detail-article?link=${encodeURIComponent(url)}`;
    
    const getActiveClass = (path: string) => currentTopic === path ? "active-link" : "";

    const heroArticle = articles[0];
    const subFeatured = articles.slice(1, 4);
    const listArticlesFull = articles.slice(4);
    const listArticlesVisible = listArticlesFull.slice(0, visibleCount);

    return (
        <div className="thoisu-container">
            <div className="section-header">
                {isBienDao ? (
                    // TRƯỜNG HỢP BIỂN ĐẢO: Chỉ hiện tiêu đề, không có menu con
                    <h2 className="section-title">
                        <Link to="/bien-dao" style={{ textDecoration: 'none', color: 'inherit' }}>Biển đảo</Link>
                    </h2>
                ) : (
                    // TRƯỜNG HỢP THỜI SỰ: Hiện tiêu đề + Menu con
                    <>
                        <h2 className="section-title">
                            <Link to="/thoi-su" style={{ textDecoration: 'none', color: 'inherit' }}>Thời sự</Link>
                        </h2>
                        <div className="sub-nav">
                            <Link to="/thoi-su/chinh-tri" className={getActiveClass('chinh-tri')}>Chính trị</Link>
                            <Link to="/thoi-su/xa-hoi" className={getActiveClass('xa-hoi')}>Xã hội</Link>
                            <Link to="/thoi-su/do-thi" className={getActiveClass('do-thi')}>Đô thị</Link>
                            <Link to="/thoi-su/chuyen-thuong-ngay" className={getActiveClass('chuyen-thuong-ngay')}>Chuyện thường ngày ở phường xã</Link>
                            <Link to="/bien-dao" style={{ textDecoration: 'none', color: '#666' }}>Biển đảo</Link>
                        </div>
                    </>
                )}
            </div>

            {loading ? (
                <div style={{textAlign:'center', padding:'50px'}}>Đang tải tin {currentTopic === 'bien-dao' ? 'Biển đảo' : ''}...</div>
            ) : (
                <>
                    {/* --- PHẦN HIỂN THỊ TIN TỨC (Dùng chung cho cả 2 trang) --- */}
                    {heroArticle && (
                        <div className="hero-wrapper">
                            <div className="hero-image">
                                <Link to={getDetailLink(heroArticle.link)}>
                                    <img src={extractImage(heroArticle)} alt={heroArticle.title} />
                                </Link>
                            </div>
                            <div className="hero-info">
                                <h3>
                                    <Link to={getDetailLink(heroArticle.link)}>{heroArticle.title}</Link>
                                </h3>
                                <p>{cleanDescription(heroArticle.description || heroArticle.contentSnippet).replace(/^(.*?) - /, '')}</p>
                            </div>
                        </div>
                    )}
 
                    <div className="sub-featured-grid">
                        {subFeatured.map((item, index) => (
                            <div key={index} className="sub-card">
                                <Link to={getDetailLink(item.link)} className="sub-img-link">
                                    <img src={extractImage(item)} alt={item.title} />
                                </Link>
                                <h4>
                                    <Link to={getDetailLink(item.link)}>{item.title}</Link>
                                </h4>
                            </div>
                        ))}
                    </div>

                    <div className="divider-line"></div>
                    {/* --- PHẦN LAYOUT 2 CỘT MỚI --- */}
                    <div className="thoisu-body-flex">
                        <div className="main-column">
                            <div className="news-list">
                                {listArticlesVisible.map((item, index) => (
                                    <div key={index} className="news-item">
                                        <div className="news-thumb">
                                            <Link to={getDetailLink(item.link)}>
                                                <img src={extractImage(item)} alt={item.title} />
                                            </Link>
                                        </div>
                                        <div className="news-content">
                                            <h3 className="news-title">
                                                <Link to={getDetailLink(item.link)}>{item.title}</Link>
                                            </h3>
                                            <p className="news-sapo">
                                                {cleanDescription(item.description || item.contentSnippet).replace(/^(.*?) - /, '')}
                                            </p>
                                            <div className="news-meta">
                                                <span>{new Date(item.pubDate).toLocaleString('vi-VN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Nút Xem thêm */}
                            {visibleCount < listArticlesFull.length && (
                                <div className="load-more-container">
                                    <button onClick={handleLoadMore} className="btn-load-more">XEM THÊM</button>
                                </div>
                            )}
                        </div>
                        {/* CỘT PHẢI: SIDEBAR */}
                        <div className="right-sidebar">
                            <Sidebar />
                        </div>
                    </div>
                    
                </>
            )}
        </div>
    );
}

export default ThoiSuPage;