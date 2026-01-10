import React from 'react';
import { Link } from 'react-router-dom';
import './BottomNewsSection.css';

interface NewsItem {
    item: {
        title: string;
        link: string;
        content: string; 
        contentSnippet?: string;
    }
}

interface BottomNewsProps {
    newsList: NewsItem[];    
    hotAnswer?: NewsItem;      
    socialTrace?: NewsItem;
    speakStraight?: NewsItem;    
    perspective?: NewsItem;     
    englishNews?: NewsItem[];
    mostViewed: NewsItem[];     
}

const getImgSrc = (content: string | undefined): string => {
    const regex = /<img[^>]+src="([^">]+)"/;
    const match = (content || "").match(regex);
    return match ? match[1] : "https://static.nld.com.vn/image/logo.svg";
};

const cleanSapo = (sapo: string | undefined): string => {
    if (!sapo) return "";
    return sapo.replace(/<\/?[^>]+(>|$)/g, "").replace(/^\(NLĐO\)\s*-\s*/i, "").substring(0, 100) + "...";
};

const BottomNewsSection: React.FC<BottomNewsProps> = ({ 
    newsList, hotAnswer, socialTrace, speakStraight, perspective, englishNews, mostViewed
}) => {
    if (!newsList || newsList.length === 0) return null;

    const renderWidget = (title: string, data?: NewsItem, icon?: string) => {
        if (!data) return null;
        return (
            <div className="bn-widget-item">
                <h4 className="bn-widget-header">
                   {icon && <i className={icon} style={{marginRight:5, color:'#005689'}}></i>}
                   {title}
                </h4>
                <div className="bn-widget-content">
                    <Link to={`/detail-article?link=${encodeURIComponent(data.item.link)}`}>
                        <div className="bn-widget-thumb">
                            <img src={getImgSrc(data.item.content)} alt={data.item.title} />
                        </div>
                        <h5 className="bn-widget-title-text">{data.item.title}</h5>
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <div className="bottom-news-section">
            <div className="bn-container">

                <div className="bn-col-news">
                    {newsList.map((item, index) => (
                        <div key={index} className="bn-news-row">
                            <div className="bn-news-info">
                                <h3 className="bn-news-title">
                                    <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                        {item.item.title}
                                    </Link>
                                </h3>
                                <p className="bn-news-sapo">
                                    <span className="bn-prefix">(NLĐO) - </span>
                                    {cleanSapo(item.item.contentSnippet)}
                                </p>
                            </div>
                            <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`} className="bn-news-thumb">
                                <img src={getImgSrc(item.item.content)} alt={item.item.title} loading="lazy" />
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="bn-right-group">

                    <div className="bn-right-top-split">

                        <div className="bn-col-widgets">
                            <div className="bn-widget-row">
                                {renderWidget("Hỏi nóng – đáp nhanh", hotAnswer)}
                                {renderWidget("Truy vết mạng xã hội", socialTrace)}
                            </div>
                            <div className="bn-divider"></div>
                            <div className="bn-widget-row">
                                {renderWidget("Nói thẳng", speakStraight || hotAnswer, "fa fa-comment")}
                                {renderWidget("Góc nhìn", perspective || socialTrace, "fa fa-eye")}
                            </div>
                        </div>

                        <div className="bn-col-view">
                            <h4 className="bn-view-header">Xem nhiều</h4>
                            <ul className="bn-view-list">
                                {mostViewed.map((item, index) => (
                                    <li key={index}>
                                        <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                            {item.item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {englishNews && englishNews.length > 0 && (
                        <div className="bn-english-box">
                            <div className="en-header">
                                <div className="en-logo-area">
                                    <img src="https://static.mediacdn.vn/nld.com.vn/image/Logoenglish2.png" alt="NLD English" className="sub-logo"/>
                                </div>
                                <div className="en-nav">
                                    <a href="#">Politics</a>
                                    <a href="#">Ho Chi Minh City</a>
                                    <a href="#">BizLIVE</a>
                                </div>
                                <a href="#" className="en-see-all">See all</a>
                            </div>
                            
                            <div className="en-content">
                                <div className="en-hero">
                                    <Link to={`/detail-article?link=${encodeURIComponent(englishNews[0].item.link)}`} className="en-hero-link">
                                        <div className="en-hero-thumb">
                                            <img src={getImgSrc(englishNews[0].item.content)} alt={englishNews[0].item.title} />
                                        </div>
                                        <div className="en-hero-info">
                                            <h3 className="en-hero-title">{englishNews[0].item.title}</h3>
                                            <p className="en-hero-sapo">{cleanSapo(englishNews[0].item.contentSnippet)}</p>
                                        </div>
                                    </Link>
                                </div>

                                <div className="en-sub-row">
                                    {englishNews.slice(1, 4).map((item, idx) => (
                                        <div key={idx} className="en-sub-col">
                                            <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                               • {item.item.title}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default BottomNewsSection;