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

    exclusive?: NewsItem;       // Độc quyền
    laborExport?: NewsItem;     // Xuất khẩu lao động
    finance?: NewsItem;         // Tài chính - Chứng khoán
    podcast?: NewsItem[];       // Podcast
    flagNews?: NewsItem[];      // Dữ liệu cho mục Tự hào cờ tổ quốc

    education?: NewsItem[];
    health?: NewsItem[];
    sports?: NewsItem[];

    exchangeRates?: {
        USD: { buy: string, sell: string },
        EUR: { buy: string, sell: string }
    };
    vietlottData?: {
        numbers: number[];
        special: number;
        date: string;
        jackpot: string;
    };
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
    newsList, hotAnswer, socialTrace, speakStraight, perspective, englishNews, mostViewed,
    exclusive, laborExport, finance, podcast, flagNews, exchangeRates, vietlottData, education, health, sports
}) => {
    // Fallback nếu API lỗi hoặc chưa load xong
    const displayLotto = vietlottData || {
        numbers: ["-", "-", "-", "-", "-", "-"],
        special: "-",
        date: "Đang cập nhật...",
        jackpot: "..."
    };

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
   
    const renderSmallColumn = (title: string, data?: NewsItem, iconClass?: string, slug?: string) => {
        if (!data) return null;
        return (
            <div className="bn-small-col">
                <h4 className="bn-small-header">
                    {slug ? (
                        <Link to={`/${slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {iconClass && <i className={iconClass}></i>} {title}
                        </Link>
                    ) : (
                        <>{iconClass && <i className={iconClass}></i>} {title}</>
                    )}
                </h4>
                <Link to={`/detail-article?link=${encodeURIComponent(data.item.link)}`} className="bn-small-link">
                    <div className="bn-small-thumb">
                        <img src={getImgSrc(data.item.content)} alt={data.item.title} />
                    </div>
                    <h5 className="bn-small-title">{data.item.title}</h5>
                    <p className="bn-small-sapo">{cleanSapo(data.item.contentSnippet)}</p>
                </Link>
            </div>
        );
    }
    // Hàm render danh mục (Giáo dục, Sức khỏe, Thể thao)
    const renderCategoryBlock = (
        title: string, 
        iconClass: string, 
        visibleLinks: {label: string, url: string}[], 
        dropdownLinks: {label: string, url: string}[] | null, // Danh sách link ẩn
        data?: NewsItem[]
    ) => {
        if (!data || data.length === 0) return null;

        const mainLeft = data[0];       
        const subRight = data[1];       
        const textItems = data.slice(2, 4);

        return (
            <div className="bn-cat-widget">
                <div className="bn-cat-header">
                    <h4 className="cat-title">
                        <i className={iconClass}></i> {title}
                    </h4>
                    <div className="cat-nav">
                        {visibleLinks.map((link, idx) => (
                            <Link key={idx} to={link.url}>{link.label}</Link>
                        ))}

                        {dropdownLinks && dropdownLinks.length > 0 && (
                            <div className="cat-dropdown-container">
                                <span className="cat-nav-icon">▼</span>
                                
                                <ul className="cat-dropdown-menu">
                                    {dropdownLinks.map((link, idx) => (
                                        <li key={idx}>
                                            <Link to={link.url}>{link.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="bn-cat-content">
                    <div className="cat-col-left">
                        <Link to={`/detail-article?link=${encodeURIComponent(mainLeft.item.link)}`} className="cat-main-link">
                            <div className="cat-main-thumb">
                                <img src={getImgSrc(mainLeft.item.content)} alt={mainLeft.item.title} />
                            </div>
                            <div className="cat-main-info">
                                <h3 className="cat-main-title">{mainLeft.item.title}</h3>
                                <p className="cat-main-sapo">{cleanSapo(mainLeft.item.contentSnippet)}</p>
                            </div>
                        </Link>

                        {textItems.length > 0 && (
                            <div className="cat-text-row">
                                {textItems.map((item, idx) => (
                                    <div key={idx} className="cat-text-item">
                                        <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                            • {item.item.title}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {subRight && (
                        <div className="cat-col-right">
                            <Link to={`/detail-article?link=${encodeURIComponent(subRight.item.link)}`} className="cat-side-link">
                                <div className="cat-side-thumb">
                                    <img src={getImgSrc(subRight.item.content)} alt={subRight.item.title} />
                                </div>
                                <h4 className="cat-side-title">{subRight.item.title}</h4>
                            </Link>
                        </div>
                    )}
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
                    <div className="bn-three-cols">
                        {renderSmallColumn("Độc quyền", exclusive, "fa fa-bolt", "doc-quyen")}
                        {renderSmallColumn("Xuất khẩu lao động", laborExport, "fa fa-globe", "lao-dong/xuat-khau-lao-dong")}
                        {renderSmallColumn("Tài chính – Chứng khoán", finance, "fa fa-chart-line", "kinh-te/tai-chinh-chung-khoan")}
                    </div>

                    {podcast && podcast.length > 0 && (
                        <div className="home__ns-podcast-isolated">
                            <div className="podcast-header">
                                <a href="/" className="podcast-logo" title="Podcast">
                                    <img src="https://static.mediacdn.vn/nld.com.vn/image/logo-podcast.png" alt="Podcast" />
                                </a>
                                <div className="podcast-tabs">
                                    <a href="#" className="tab-item">
                                        <span className="tab-icon">
                                            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M7.72413 5.32843C8.00186 5.24512 8.29453 5.40271 8.37785 5.68043L9.50285 9.43043C9.51753 9.47937 9.52499 9.5302 9.52499 9.58129V13.3313C9.52499 13.6212 9.28994 13.8563 8.99999 13.8563C8.71004 13.8563 8.47499 13.6212 8.47499 13.3313V9.65834L7.37213 5.98215C7.28882 5.70443 7.44641 5.41175 7.72413 5.32843Z" fill="white"></path>
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.00004 3.91865C5.87272 3.91865 3.33754 6.45384 3.33754 9.58115C3.33754 12.7085 5.87272 15.2437 9.00004 15.2437C12.1273 15.2437 14.6625 12.7085 14.6625 9.58115C14.6625 6.45384 12.1273 3.91865 9.00004 3.91865ZM2.28754 9.58115C2.28754 5.87394 5.29283 2.86865 9.00004 2.86865C12.7072 2.86865 15.7125 5.87394 15.7125 9.58115C15.7125 13.2884 12.7072 16.2937 9.00004 16.2937C5.29283 16.2937 2.28754 13.2884 2.28754 9.58115Z" fill="white"></path>
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.403 2.05221C13.608 1.84718 13.9404 1.84718 14.1454 2.05221L16.529 4.4358C16.7341 4.64083 16.7341 4.97324 16.529 5.17826C16.324 5.38329 15.9916 5.38329 15.7866 5.17826L13.403 2.79467C13.198 2.58964 13.198 2.25723 13.403 2.05221Z" fill="white"></path>
                                                <path fillRule="evenodd" clipRule="evenodd" d="M4.59702 2.05221C4.80205 2.25723 4.80205 2.58964 4.59702 2.79467L2.21343 5.17826C2.00841 5.38329 1.67599 5.38329 1.47097 5.17826C1.26594 4.97324 1.26594 4.64083 1.47097 4.4358L3.85456 2.05221C4.05959 1.84718 4.392 1.84718 4.59702 2.05221Z" fill="white"></path>
                                            </svg>                                            
                                        </span>
                                        11 giờ 30
                                    </a>
                                    <a href="#" className="tab-item">
                                        <span className="tab-icon"><svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 15.9565C12.7279 15.9565 15.75 12.9345 15.75 9.20654C15.75 5.47862 12.7279 2.45654 9 2.45654C5.27208 2.45654 2.25 5.47862 2.25 9.20654C2.25 12.9345 5.27208 15.9565 9 15.9565Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path><path d="M6.8125 7.80029C6.8125 7.99014 6.6586 8.14404 6.46875 8.14404C6.2789 8.14404 6.125 7.99014 6.125 7.80029C6.125 7.61045 6.2789 7.45654 6.46875 7.45654C6.6586 7.45654 6.8125 7.61045 6.8125 7.80029Z" fill="white" stroke="white"></path><path d="M10.6875 7.80029H12.375" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11.9251 10.894C11.6277 11.4063 11.201 11.8316 10.6877 12.1271C10.1744 12.4227 9.59242 12.5783 9.00007 12.5783C8.40773 12.5783 7.82578 12.4227 7.31245 12.1271C6.79912 11.8316 6.37243 11.4063 6.07507 10.894" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                                        Giới trẻ
                                    </a>
                                    <a href="#" className="tab-item">
                                        <span className="tab-icon"><svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 11.1753C10.0873 11.1753 10.9688 10.2939 10.9688 9.20654C10.9688 8.11923 10.0873 7.23779 9 7.23779C7.91269 7.23779 7.03125 8.11923 7.03125 9.20654C7.03125 10.2939 7.91269 11.1753 9 11.1753Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8.08594 7.46279C7.57266 6.37998 7.03125 5.02998 7.03125 4.14404C7.03125 3.6219 7.23867 3.12114 7.60788 2.75193C7.9771 2.38271 8.47786 2.17529 9 2.17529C9.52214 2.17529 10.0229 2.38271 10.3921 2.75193C10.7613 3.12114 10.9688 3.6219 10.9688 4.14404C10.9688 5.02998 10.4273 6.37998 9.91406 7.46279" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7.03125 9.12228C5.83594 9.03087 4.39453 8.81994 3.62813 8.37697C3.20684 8.10134 2.90715 7.67478 2.79067 7.185C2.67419 6.69521 2.74977 6.17941 3.00187 5.74363C3.25397 5.30786 3.66344 4.98522 4.1461 4.84204C4.62875 4.69886 5.14792 4.74603 5.59688 4.97384C6.36328 5.40978 7.26328 6.55587 7.94531 7.54728" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7.94529 10.866C7.26326 11.8574 6.36326 13.0035 5.59686 13.4395C5.37289 13.586 5.12141 13.6853 4.85776 13.7314C4.59412 13.7774 4.32385 13.7692 4.06348 13.7073C3.80311 13.6454 3.55809 13.531 3.34341 13.3712C3.12872 13.2114 2.94887 13.0095 2.81485 12.7778C2.68083 12.5462 2.59545 12.2896 2.56393 12.0238C2.53241 11.7581 2.55541 11.4887 2.63153 11.2321C2.70764 10.9755 2.83527 10.7371 3.00662 10.5315C3.17797 10.3259 3.38944 10.1574 3.6281 10.0363C4.39451 9.59336 5.83592 9.38242 7.03123 9.29102" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9.91406 10.9502C10.4273 12.033 10.9688 13.383 10.9688 14.2689C10.9688 14.7911 10.7613 15.2918 10.3921 15.6611C10.0229 16.0303 9.52214 16.2377 9 16.2377C8.47786 16.2377 7.9771 16.0303 7.60788 15.6611C7.23867 15.2918 7.03125 14.7911 7.03125 14.2689C7.03125 13.383 7.57266 12.033 8.08594 10.9502" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.9688 9.29102C12.1641 9.38242 13.6055 9.59336 14.3719 10.0363C14.7932 10.312 15.0929 10.7385 15.2093 11.2283C15.3258 11.7181 15.2502 12.2339 14.9981 12.6697C14.746 13.1054 14.3366 13.4281 13.8539 13.5713C13.3712 13.7144 12.8521 13.6673 12.4031 13.4395C11.6367 13.0035 10.7367 11.8574 10.0547 10.866" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.0547 7.54728C10.7367 6.55587 11.6367 5.40978 12.4031 4.97384C12.8521 4.74603 13.3712 4.69886 13.8539 4.84204C14.3366 4.98522 14.746 5.30786 14.9981 5.74363C15.2502 6.17941 15.3258 6.69521 15.2093 7.185C15.0929 7.67478 14.7932 8.10134 14.3719 8.37697C13.6055 8.81994 12.1641 9.03087 10.9688 9.12228" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                                        Bàn tròn phái đẹp
                                    </a>
                                    <a href="#" className="tab-item">
                                        <span className="tab-icon"><svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.375 13.144V12.019C12.375 11.1239 12.0194 10.2655 11.3865 9.63256C10.7536 8.99962 9.89511 8.64404 9 8.64404C8.10489 8.64404 7.24645 8.99962 6.61351 9.63256C5.98058 10.2655 5.625 11.1239 5.625 12.019V13.144" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path><path d="M14.625 13.144V12.019C14.625 10.5272 14.0324 9.09646 12.9775 8.04157C11.9226 6.98668 10.4918 6.39404 9 6.39404C7.50816 6.39404 6.07742 6.98668 5.02252 8.04157C3.96763 9.09646 3.375 10.5272 3.375 12.019V13.144" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16.875 13.144V12.019C16.875 9.93046 16.0453 7.92743 14.5685 6.45058C13.0916 4.97373 11.0886 4.14404 9 4.14404C6.91142 4.14404 4.90838 4.97373 3.43153 6.45058C1.95469 7.92743 1.125 9.93046 1.125 12.019V13.144" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path></svg> </span>
                                        Cầu vồng hạnh phúc
                                    </a>
                                </div>
                            </div>

                            <div className="podcast-body">
                                <div className="podcast-main-item">
                                    <a href="#" onClick={(e) => e.preventDefault()} className="podcast-thumb-link">
                                        <img src={getImgSrc(podcast[0].item.content)} alt={podcast[0].item.title} className="podcast-thumb-img" />
                                    </a>
                                    <div className="podcast-info">
                                        <h3 className="podcast-title">
                                            <a href="#" onClick={(e) => e.preventDefault()}>
                                                {podcast[0].item.title}
                                            </a>
                                        </h3>
                                        <div className="podcast-actions">
                                            <a href="#" onClick={(e) => e.preventDefault()} className="btn-listen">
                                                <svg width="14" height="14" viewBox="0 0 16 17" fill="none"><path d="M8.00037 0.831543C3.58891 0.831543 0.000366211 4.41891 0.000366211 8.82821V12.2701C0.000366211 12.271 0.000854492 12.2717 0.000854492 12.2725V13.1664C0.000854492 14.0527 0.347493 14.8924 0.967489 15.5188L1.88749 16.4451L3.22083 16.8315H3.24084C4.34082 16.8315 5.24084 15.9319 5.24084 14.8324V10.9007C5.24084 9.80115 4.34082 8.90154 3.24084 8.90154H3.22083L1.88749 9.29469L1.3337 9.85045V8.82821C1.3337 5.15363 4.32458 2.16432 8.00037 2.16432C11.6761 2.16432 14.667 5.15363 14.667 8.82821V9.84996L14.1137 9.29469L12.7804 8.90154H12.7604C11.6604 8.90154 10.7604 9.80115 10.7604 10.9007V14.8324C10.7604 15.9319 11.6604 16.8315 12.7604 16.8315H12.7804L14.1137 16.4451L15.0337 15.5188C15.6537 14.8924 16.0004 14.0527 16.0004 13.1664C16.0004 13.098 16.0004 8.75978 16.0004 8.82821C16.0004 4.41891 12.4118 0.831543 8.00037 0.831543Z" fill="#005BB2"></path></svg>
                                                Nghe tập này
                                            </a>
                                            <span className="time-duration">07:06</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="podcast-sub-list">
                                    {podcast.slice(1, 3).map((item, idx) => (
                                        <div key={idx} className="podcast-sub-item">
                                            <span className="sub-icon"></span>
                                            <a href="#" onClick={(e) => e.preventDefault()} className="sub-title">
                                                {item.item.title}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {flagNews && flagNews.length > 0 && (
                        <div className="bn-flag-section">
                            <h4 className="bn-section-header red-flag">
                                <i className="fa fa-flag" ></i> Tự hào cờ tổ quốc
                            </h4>
                            <div className="bn-flag-list">
                                {flagNews.slice(0, 2).map((item, idx) => (
                                    <Link key={idx} to={`/detail-article?link=${encodeURIComponent(item.item.link)}`} className="bn-flag-item">
                                        <div className="bn-flag-thumb">
                                            <img src={getImgSrc(item.item.content)} alt={item.item.title} />
                                        </div>
                                        <h5 className="bn-flag-title">{item.item.title}</h5>
                                        <p className="bn-flag-sapo">{cleanSapo(item.item.contentSnippet)}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bn-contests-section">
                        <h4 className="bn-section-header">
                            <i className="fa fa-trophy" style={{color: '#d48d28'}}></i> Các cuộc thi khác đang chờ bạn
                        </h4>
                        <div className="bn-contest-list">
                            <div className="bn-contest-item">
                                <img src="https://nld.mediacdn.vn/zoom/104_104/291774122806476800/2023/11/29/rectangle-1225-4-1701221929066910932049.png" alt="Contest 1" />
                            </div>
                            <div className="bn-contest-item">
                                <img src="https://nld.mediacdn.vn/zoom/104_104/291774122806476800/2023/9/21/rectangle-1225-1-1693900030418161769919-16952925086121610184025.png" alt="Contest 2" />
                            </div>
                            <div className="bn-contest-item">
                                <img src="https://nld.mediacdn.vn/zoom/104_104/291774122806476800/2023/9/21/rectangle-1225-2-16939000303821286919412-1695292530664794641331.png" alt="Contest 3" />
                            </div>
                            <div className="bn-contest-item">
                                <img src="https://nld.mediacdn.vn/zoom/104_104/291774122806476800/2023/9/21/rectangle-1225-3-1693900030362451538564-169529255266561075350.png" alt="Contest 4" />
                            </div>
                            <div className="bn-contest-item">
                                <img src="https://nld.mediacdn.vn/zoom/104_104/291774122806476800/2023/9/21/rectangle-1225-5-1693900030317760775449-169529258209037581898.png" alt="Contest 4" />
                            </div>
                        </div>
                    </div>

                    <div className="bn-utility-section">
                        <div className="bn-utility-col exchange-rate">
                            <table className="bn-rate-table">
                                <thead>
                                    <tr>
                                        <th>TỶ GIÁ</th>
                                        <th>MUA</th>
                                        <th>BÁN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>USD/VNĐ</td>
                                        <td>{exchangeRates ? exchangeRates.USD.buy : "Loading..."}</td>
                                        <td>{exchangeRates ? exchangeRates.USD.sell : "Loading..."}</td>
                                    </tr>
                                    <tr>
                                        <td>EUR/VNĐ</td>
                                        <td>{exchangeRates ? exchangeRates.EUR.buy : "Loading..."}</td>
                                        <td>{exchangeRates ? exchangeRates.EUR.sell : "Loading..."}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="bn-rate-footer">
                                <i className="fa fa-calculator"></i> Kết quả xổ số
                            </div>
                        </div>

                        <div className="bn-utility-col vietlott-col">
                            <div className="vietlott-header">
                                <h4>Kết quả xổ số tự chọn</h4>
                                <img src="https://static.mediacdn.vn/nld.com.vn/images/logo-vietlott.png" alt="Vietlott" width="60" />
                            </div>
                            <div className="vietlott-content">
                                <div className="vietlott-row">
                                    <div className="vl-type">Power 6/55</div>
        
                                    <div className="vl-date">Kỳ quay: {displayLotto.date}</div>
                                    
                                    <div className="vl-balls">
                                        {displayLotto.numbers.map((num: any, i: number) => (
                                            <span key={i}>{typeof num === 'number' && num < 10 ? `0${num}` : num}</span>
                                        ))}
                                        <span className="yellow">
                                            {typeof displayLotto.special === 'number' && displayLotto.special < 10 
                                                ? `0${displayLotto.special}` 
                                                : displayLotto.special}
                                        </span>
                                    </div>
                                    <div className="vl-jackpot">Jackpot 1: <strong>{displayLotto.jackpot}</strong></div>
                                </div>
                                <div className="vietlott-link">
                                    Xem kết quả Max 3D, 3D PRO, KENO, BINGO 18
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bn-bottom-cats">
                        {renderCategoryBlock(
                            "Giáo dục", "fa fa-graduation-cap", 
                            [{label: "Du học", url: "/giao-duc-khoa-hoc/du-hoc"}, {label: "Tuyển sinh", url: "/giao-duc-khoa-hoc/tuyen-sinh"}, {label: "Sau bục giảng", url: "/giao-duc-khoa-hoc/sau-buc-giang"}], 
                            null, 
                            education
                        )}
                        
                        <div className="bn-divider"></div>

                        {renderCategoryBlock(
                            "Sức khỏe", "fa fa-heartbeat", 
                            [{label: "Chuyển động y học", url: "/suc-khoe/chuyen-dong-y-hoc"}, {label: "Giới tính", url: "/suc-khoe/gioi-tinh"}, {label: "Bác sĩ của bạn", url: "/suc-khoe/bac-si-cua-ban"}], 
                            null, 
                            health
                        )}

                        <div className="bn-divider"></div>
                        {renderCategoryBlock(
                            "Thể thao", "fa fa-futbol", 
                            [{label: "Bóng đá", url: "/the-thao/bong-da"}, {label: "Golf", url: "/the-thao/golf"}, {label: "Hậu trường", url: "/the-thao/hau-truong"}], 
                            [
                                {label: "Các môn khác", url: "/the-thao/cac-mon-khac"},
                                {label: "Tennis", url: "/the-thao/tennis"},
                                {label: "Marathon", url: "/the-thao/marathon"}
                            ],
                            sports
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BottomNewsSection;