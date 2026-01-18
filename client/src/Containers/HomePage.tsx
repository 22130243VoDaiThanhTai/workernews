import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import DataFetch from "../Components/fetchRSS/DataFetch";
import './HomePage.css';
import VipReaderSection from "../Components/Home/VipReaderSection";
import BottomNewsSection from "../Components/Home/BottomNewsSection";
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

interface HomeRequestPayload {
    signal: "datafetch";
    datapage: string;
}

// === DỮ LIỆU GIẢ LẬP DÒNG SỰ KIỆN ===
const TRENDING_TOPICS = [
    { id: 1, title: "Vụ án Tập đoàn Thuận An", link: "#" },
    { id: 2, title: "Giảm nghèo bền vững", link: "#" },
    { id: 3, title: "Xung đột Nga - Ukraine", link: "#" },
    { id: 4, title: "Thị trường Tết 2026", link: "#" },
    { id: 5, title: "Đại hội Đảng", link: "/dai-hoi-dang" },
    { id: 6, title: "Venezuela bị tấn công", link: "#" },
];

const getImgSrc = (content: string | undefined): string => {
    const regex = /<img[^>]+src="([^">]+)"/;
    const match = (content || "").match(regex);
    return match ? match[1] : "https://static.nld.com.vn/image/logo.svg";
};

const cleanSapo = (sapo: string | undefined, limit: number = 150): string => {
    if (!sapo) return "";
    let text = sapo.replace(/<\/?[^>]+(>|$)/g, ""); 
    text = text.replace(/^\(NLĐO\)\s*-\s*/i, "");
    if (text.length > limit) return text.substring(0, limit) + "...";
    return text;
};

const HomePage = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [tinNong, setTinNong] = useState<NewsItem[]>([]);
    const [vipNews, setVipNews] = useState<NewsItem[]>([]);
    const [bottomNewsData, setBottomNewsData] = useState<any>({
        newsList: [],
        hoiNong: null,
        truyVet: null,
        viewList: []
    });
    const [englishNews, setEnglishNews] = useState<NewsItem[]>([]);
    const [extraSections, setExtraSections] = useState<any>({});
    const [exchangeRates, setExchangeRates] = useState<any>(null);
    const [vietlottData, setVietlottData] = useState<any>(null);
    const [education, setEducation] = useState<any[]>([]);
    const [health, setHealth] = useState<any[]>([]);
    const [sports, setSports] = useState<any[]>([]);
    useEffect(() => {
        const loadData = async () => {
            try {
                const [dataHome, dataHot, dataVip, dataEnglish, dataDocQuyen,
                    dataXKLD,
                    dataTaiChinh,
                    dataPodcast,
                    dataFlag, 
                    dataRates,
                    dataLotto,
                    dataEducation,
                    dataHealth, 
                    dataSports] = await Promise.all([
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "home" 
                    }),
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "home" 
                    }),
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "danh-cho-ban-doc-vip" 
                    }),
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "english-news" 
                    }),
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "doc-quyen" 
                    }),
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "xuat-khau-lao-dong" 
                    }),
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "tai-chinh-chung-khoan" 
                    }),
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "podcast" 
                    }),

                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "tu-hao-co-to-quoc" 
                    }),

                    DataFetch<any, HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "exchange-rate" 
                    }),
                    DataFetch<any, HomeRequestPayload>(SERVER_LINK, { 
                        signal: "datafetch", 
                        datapage: "vietlott-real" 
                    }),
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { signal: "datafetch", datapage: "giao-duc" }),
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { signal: "datafetch", datapage: "suc-khoe" }),
                    DataFetch<NewsItem[], HomeRequestPayload>(SERVER_LINK, { signal: "datafetch", datapage: "the-thao" })
                ]);
               

                if (dataHome) setNews(dataHome);
                // Lấy 20 tin nóng để test chức năng cuộn
                if (dataHot) setTinNong(dataHot.slice(0, 20));
                if (dataVip) setVipNews(dataVip.slice(0, 15));
                if (dataEnglish) setEnglishNews(dataEnglish);
                if (dataRates) setExchangeRates(dataRates);
                if (dataLotto) setVietlottData(dataLotto);
                if (dataEducation) setEducation(dataEducation);
                if (dataHealth) setHealth(dataHealth);
                if (dataSports) setSports(dataSports);
                if (dataHome && dataHome.length > 20) {
                    
                    // 1. Cột trái: Lấy bài từ index 1 đến 10
                    const leftNews = dataHome.slice(1, 20);
                    
                    // 2. Widget Hỏi nóng: Lấy bài index 11
                    const hoiNong = dataHome[21];

                    // 3. Widget Truy vết: Lấy bài index 12 
                    const truyVet = dataHome[22];

                    // 4. Xem nhiều: Lấy bài index 13 đến 18
                    const mostViewed = dataHome.slice(23, 28);
                    
                    setBottomNewsData({
                        newsList: leftNews,
                        hoiNong: hoiNong,
                        truyVet: truyVet,
                        viewList: mostViewed
                    });
                }
                setExtraSections({
                    exclusive: dataDocQuyen ? dataDocQuyen[0] : null,
                    labor: dataXKLD ? dataXKLD[0] : null,
                    finance: dataTaiChinh ? dataTaiChinh[0] : null,
                    podcastList: dataPodcast || [], // Podcast lấy cả danh sách
                    flagNews: dataFlag ? dataFlag.slice(0, 2) : []
                });
            } catch (error) {
                console.error("Lỗi tải trang chủ:", error);
            }
        };
        loadData();
    }, []);

    const mainArticle = news[0];
    const middleArticles = news.slice(1, 3);
    const bottomRowArticles = news.slice(3, 6);

    if (news.length === 0) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải...</div>;

    return (
        <div className="home_container">
            <div className="home_fflex">

                {/* === CỘT TRÁI (NỘI DUNG CHÍNH) === */}
                <div className="home_fmain">
                    
                    {/* 1. Tin chính + Tin phụ (Có ảnh) */}
                    <div className="home_top_section">
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

                    {/* 2. Hàng tin phụ (Text) - ĐÃ ĐƯA LÊN TRÊN TRENDING */}
                    <div className="home_bottom_row">
                        {bottomRowArticles.map((item, index) => (
                            <div key={index} className="bottom-item-col">
                                <h3 className="bottom-title">
                                    <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                        {item.item.title}
                                    </Link>
                                </h3>
                                <p className="bottom-sapo">
                                    {cleanSapo(item.item.contentSnippet)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* 3. THANH DÒNG SỰ KIỆN (Trending Bar) - ĐÃ CHUYỂN XUỐNG DƯỚI */}
                    <div className="home__trending_bar">
                        <div className="label">
                            <span className="icon">
                                <img src="https://static.mediacdn.vn/nld.com.vn/image/icon-trending.svg" alt="icon" width="24" height="25" />
                            </span>
                        </div>
                        <div className="content">
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                slidesPerView="auto"
                                spaceBetween={15}
                                loop={true}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                navigation={{ nextEl: '.swiper-next', prevEl: '.swiper-prev' }}
                                className="home-treding-sw"
                            >
                                {TRENDING_TOPICS.map((topic, index) => (
                                    <SwiperSlide key={index} style={{ width: 'auto' }}>
                                        <div className="box-category-item">
                                            <h3 className="box-category-title-text">
                                                <Link to={topic.link} className="box-category-link-title" title={topic.title}>
                                                    {topic.title}
                                                </Link>
                                            </h3>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            
                            <div className="home-treding-sw-control">
                                <div className="swiper-prev" role="button">
                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none"><rect x="0.5" y="1.13867" width="23" height="23" rx="3.5" stroke="#111111"/><path fillRule="evenodd" clipRule="evenodd" d="M13.5303 16.169C13.8232 15.8761 13.8232 15.4012 13.5303 15.1083L11.0607 12.6387L13.5303 10.169C13.8232 9.87611 13.8232 9.40123 13.5303 9.10834C13.2374 8.81545 12.7626 8.81545 12.4697 9.10834L9.46967 12.1083C9.32902 12.249 9.25 12.4398 9.25 12.6387C9.25 12.8376 9.32902 13.0283 9.46967 13.169L12.4697 16.169C12.7626 16.4619 13.2374 16.4619 13.5303 16.169Z" fill="#111111"/></svg>
                                </div>
                                <div className="swiper-next" role="button">
                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none"><rect x="0.5" y="1.13867" width="23" height="23" rx="3.5" stroke="#111111"/><path fillRule="evenodd" clipRule="evenodd" d="M10.4697 16.169C10.1768 15.8761 10.1768 15.4012 10.4697 15.1083L12.9393 12.6387L10.4697 10.169C10.1768 9.87611 10.1768 9.40123 10.4697 9.10834C10.7626 8.81545 11.2374 8.81545 11.5303 9.10834L14.5303 12.1083C14.671 12.249 14.75 12.4398 14.75 12.6387C14.75 12.8376 14.671 13.0283 14.5303 13.169L11.5303 16.169C11.2374 16.4619 10.7626 16.4619 10.4697 16.169Z" fill="#111111"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* === CỘT PHẢI (SIDEBAR) === */}
                <div className="home_trending">
                    <div className="sidebar-header">
                        <span className="sidebar-label">TIN NÓNG</span>
                    </div>
                    {/* List Tin Nóng có cuộn */}
                    <div className="sidebar-content scroll-box">
                        <ul className="list-news-text">
                            {tinNong.map((item, index) => (
                                <li key={index}>
                                    <Link to={`/detail-article?link=${encodeURIComponent(item.item.link)}`}>
                                        {item.item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Banner Đại Hội Đảng */}
                    <div className="banner-dhd">
                        <Link to="/dai-hoi-dang" title="Chào mừng Đại hội Đại biểu toàn quốc lần thứ XIV của Đảng">
                            <img src="https://static.mediacdn.vn/nld.com.vn/images/banner-dhd.jpg" alt="Đại hội đảng" />
                        </Link>
                    </div>
                </div>

            </div>
            {/* DÀNH CHO BẠN ĐỌC VIP */}
            <VipReaderSection data={vipNews} />
            <BottomNewsSection 
                newsList={bottomNewsData.newsList}
                hotAnswer={bottomNewsData.hoiNong}
                socialTrace={bottomNewsData.truyVet}
                speakStraight={bottomNewsData.hoiNong}  // Demo
                perspective={bottomNewsData.truyVet}    // Demo
                englishNews={englishNews}
                mostViewed={bottomNewsData.viewList}
                
                exclusive={extraSections.exclusive}
                laborExport={extraSections.labor}
                finance={extraSections.finance}
                podcast={extraSections.podcastList}
                flagNews={extraSections.flagNews}
                exchangeRates={exchangeRates}
                vietlottData={vietlottData}
                education={education}
                health={health}
                sports={sports}
            />

        </div>
    );
};

export default HomePage;