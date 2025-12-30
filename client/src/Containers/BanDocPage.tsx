import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataFetch from "../Components/fetchRSS/DataFetch";
import "./Page.css";

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

interface BanDocPayload {
    signal: "datafetch";
    datapage: string;
}

function BanDocPage() {
    const [articles, setArticles] = useState<RSSContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(12);

    // === Lấy ảnh đại diện ===
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
                const response = await DataFetch<NewsItem[], BanDocPayload>(
                    SERVER_LINK,
                    {
                        signal: "datafetch",
                        datapage: "ban-doc"
                    }
                );

                if (Array.isArray(response)) {
                    setArticles(response.map(e => e.item));
                }
            } catch (error) {
                console.error("Lỗi tải trang Bạn đọc:", error);
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
                <h2 className="section-title">Bạn đọc</h2>
                <div className="sub-nav">
                    <a href="#">Nhà ở xã hội</a>
                    <a href="#">Tôi lên tiếng</a>
                    <a href="#">Góc ảnh bạn đọc</a>
                    <a href="#">Cuộc sống nhân ái </a>
                    <a href="#">Thư bạn đọc </a>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                    Đang tải nội dung bạn đọc...
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
                                        .replace(/^(.*?) - /, "")}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 3 bài nổi */}
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

                    {/* Danh sách bài */}
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
                                            .replace(/^(.*?) - /, "")}
                                    </p>
                                    <div className="news-meta">
                                        <span>
                                            {new Date(item.pubDate).toLocaleString("vi-VN")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

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

export default BanDocPage;
