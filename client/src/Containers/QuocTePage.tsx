import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataFetch from '../Components/fetchRSS/DataFetch';
import './Page.css';  

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
 
interface QuocTePayload {
    signal: "datafetch";
    datapage: string;
}

function QuocTePage() {
    const [articles, setArticles] = useState<RSSContent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [visibleCount, setVisibleCount] = useState<number>(12);
 
    const extractImage = (item: RSSContent): string => {
        if (item.enclosure && item.enclosure.url) return item.enclosure.url;
        const imgRegex = /<img.*?src="(.*?)"/;
        const contentToCheck = item.content || item.description || "";
        const match = contentToCheck.match(imgRegex);
        return match && match[1] ? match[1] : "https://static.nld.com.vn/image/logo.svg";
    };
 
    const cleanDescription = (html: string | undefined): string => {
        if (!html) return "";
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                 
                const response = await DataFetch<NewsItem[], QuocTePayload>(SERVER_LINK, {
                    signal: "datafetch",
                    datapage: "quoc-te" 
                });

                if (response && Array.isArray(response)) {
                    setArticles(response.map(entry => entry.item));
                }
            } catch (error) {
                console.error("Lỗi tải trang quốc tế:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + 9);
    };

    const heroArticle = articles[0];
    const subFeatured = articles.slice(1, 4);
    const listArticlesFull = articles.slice(4);
    const listArticlesVisible = listArticlesFull.slice(0, visibleCount);

    const getDetailLink = (url: string) => `/detail-article?link=${encodeURIComponent(url)}`;

    return (
        <div className="thoisu-container">
            <div className="section-header">
                
                <h2 className="section-title">Quốc tế</h2>
                <div className="sub-nav">
                    <a href="#">Hồ sơ</a>
                    <a href="#">Phân tích</a>
                    <a href="#">Người Việt năm châu</a>
                    <a href="#">Chuyện lạ</a>
                </div>
            </div>

            {loading ? (
                <div style={{textAlign:'center', padding:'50px'}}>Đang tải tin quốc tế...</div>
            ) : (
                <>
                     
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

                    {visibleCount < listArticlesFull.length && (
                        <div className="load-more-container">
                            <button onClick={handleLoadMore} className="btn-load-more">
                                XEM THÊM
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default QuocTePage;