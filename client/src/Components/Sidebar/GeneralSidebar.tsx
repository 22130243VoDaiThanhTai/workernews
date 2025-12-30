import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DataFetch from '../fetchRSS/DataFetch';
import './Sidebar.css';

const SERVER_LINK = "http://localhost:4000/";

interface RSSContent {
    title: string;
    link: string;
    description?: string;
    content?: string;
    enclosure?: { url: string };
    pubDate: string;
}
interface NewsItem { item: RSSContent; }

// Component nhỏ: Vẽ từng Widget
const SingleWidget = ({ title, rssSlug, linkSlug, basePath }: { title: string, rssSlug: string, linkSlug: string, basePath: string }) => {
    const [data, setData] = useState<RSSContent[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Gọi API với slug được truyền vào từ config
                const response = await DataFetch<NewsItem[], { signal: string, datapage: string }>(SERVER_LINK, { 
                    signal: "datafetch", 
                    datapage: rssSlug 
                });
                if (response) setData(response.map(e => e.item));
            } catch (e) { console.error(e); }
        };
        loadData();
    }, [rssSlug]);

    if (!data || data.length === 0) return null;

    const firstItem = data[0];
    const otherItems = data.slice(1, 4);
    
    // Nếu linkSlug có dấu / đầu tiên thì dùng luôn (VD: /bien-dao), ngược lại nối với basePath
    const finalLink = linkSlug.startsWith('/') ? linkSlug : `${basePath}/${linkSlug}`;
    
    const extractImage = (item: RSSContent) => {
        if (item.enclosure?.url) return item.enclosure.url;
        const match = (item.content || item.description || "").match(/<img.*?src="(.*?)"/);
        return match ? match[1] : "https://static-images.vnncdn.net/files/publish/2022/10/22/nld-logo-1065.jpg";
    };
    const getDetailLink = (url: string) => `/detail-article?link=${encodeURIComponent(url)}`;

    return (
        <div className="sidebar-widget">
            <h3 className="widget-title"><Link to={finalLink}>{title}</Link></h3>
            <div className="widget-first-item">
                <Link to={getDetailLink(firstItem.link)} className="widget-thumb">
                    <img src={extractImage(firstItem)} alt={firstItem.title} />
                </Link>
                <h4><Link to={getDetailLink(firstItem.link)}>{firstItem.title}</Link></h4>
            </div>
            <div className="widget-list">
                {otherItems.map((item, idx) => (
                    <div key={idx} className="widget-list-item">
                        <Link to={getDetailLink(item.link)}>{item.title}</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Component chính
const UniversalSidebar = ({ widgets, basePath }: { widgets: any[], basePath: string }) => {
    const location = useLocation();
    if (!widgets || widgets.length === 0) return null;

    return (
        <div className="sidebar-container">
            {widgets.map((widget, index) => {
                // Tự động ẩn widget nếu đang ở trang đó
                if (location.pathname.includes(widget.linkSlug)) return null;

                return (
                    <SingleWidget 
                        key={index}
                        title={widget.title}
                        rssSlug={widget.rssSlug}
                        linkSlug={widget.linkSlug}
                        basePath={basePath}
                    />
                );
            })}
        </div>
    );
};

export default UniversalSidebar;