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

interface LaoDongPayload {
    signal: "datafetch";
    datapage: string;
}

function LaoDongPage() {
    const [articles, setArticles] = useState<RSSContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(12);

    // === Helper lấy ảnh ===
    const extractImage = (item: RSSContent): string => {
        if (item.enclosure?.url) return item.enclosure.url;

        const imgRegex = /<img.*?src="(.*?)"/;
        const html = item.content || item.description || "";
        const match = html.match(imgRegex);

        return match?.[1] || "https://static.nld.com.vn/image/logo.svg";
    };

    // === Làm sạch HTML ===
    const cleanText = (html?: string): string => {
        if (!html) return "";
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await DataFetch<NewsItem[], LaoDongPayload>(
                    SERVER_LINK,
                    {
                        signal: "datafetch",
                        datapage: "lao-dong"
                    }
                );

                if (Array.isArray(response)) {
                    setArticles(response.map(e => e.item));
                }
            } catch (err) {
                console.error("Lỗi tải trang Lao động:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 9);
    };

    const hero = articles[0];
    const subFeatured = articles.slice(1, 4);
    const listAll = articles.slice(4);
    const listVisible = listAll.slice(0, visibleCount);

    const getDetailLink = (url: string) =>
        `/detail-article?link=${encodeURIComponent(url)}`;

    return (
        <div className="thoisu-container">
            <div className="section-header">
                <h2 className="section-title">Lao động</h2>
                <div className="sub-nav">
                    <a href="#">Việc làm</a>
                    <a href="#">Công đoàn</a>
                    <a href="#">Tiền lương</a>
                    <a href="#">Bảo hiểm</a>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    Đang tải tin lao động...
                </div>
            ) : (
                <>
                    {/* HERO */}
                    {hero && (
                        <div className="hero-wrapper">
                            <div className="hero-image">
                                <Link to={getDetailLink(hero.link)}>
                                    <img src={extractImage(hero)} alt={hero.title} />
                                </Link>
                            </div>
                            <div className="hero-info">
                                <h3>
                                    <Link to={getDetailLink(hero.link)}>
                                        {hero.title}
                                    </Link>
                                </h3>
                                <p>
                                    {cleanText(hero.description || hero.contentSnippet)
                                        .replace(/^(.*?) - /, '')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 3 TIN NỔI */}
                    <div className="sub-featured-grid">
                        {subFeatured.map((item, index) => (
                            <div key={index} className="sub-card">
                                <Link to={getDetailLink(item.link)} className="sub-img-link">
                                    <img src={extractImage(item)} alt={item.title} />
                                </Link>
                                <h4>
                                    <Link to={getDetailLink(item.link)}>
                                        {item.title}
                                    </Link>
                                </h4>
                            </div>
                        ))}
                    </div>

                    <div className="divider-line"></div>

                    {/* DANH SÁCH */}
                    <div className="news-list">
                        {listVisible.map((item, index) => (
                            <div key={index} className="news-item">
                                <div className="news-thumb">
                                    <Link to={getDetailLink(item.link)}>
                                        <img src={extractImage(item)} alt={item.title} />
                                    </Link>
                                </div>
                                <div className="news-content">
                                    <h3 className="news-title">
                                        <Link to={getDetailLink(item.link)}>
                                            {item.title}
                                        </Link>
                                    </h3>
                                    <p className="news-sapo">
                                        {cleanText(item.description || item.contentSnippet)
                                            .replace(/^(.*?) - /, '')}
                                    </p>
                                    <div className="news-meta">
                                        <span>
                                            {new Date(item.pubDate).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* LOAD MORE */}
                    {visibleCount < listAll.length && (
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

export default LaoDongPage;
