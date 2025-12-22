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
// QUAN TRỌNG: Giữ nguyên signal là string
interface Payload { signal: string; datapage: string; } 

const CategoryWidget = ({ title, slug, data }: { title: string, slug: string, data: RSSContent[] }) => {
    // Nếu không có dữ liệu thì không hiển thị gì cả
    if (!data || data.length === 0) return null;
    
    const firstItem = data[0]; 
    const otherItems = data.slice(1, 4); 

    const extractImage = (item: RSSContent) => {
        if (item.enclosure?.url) return item.enclosure.url;
        const match = (item.content || item.description || "").match(/<img.*?src="(.*?)"/);
        return match ? match[1] : "https://static-images.vnncdn.net/files/publish/2022/10/22/nld-logo-1065.jpg";
    };
    const getDetailLink = (url: string) => `/detail-article?link=${encodeURIComponent(url)}`;

    return (
        <div className="sidebar-widget">
            <h3 className="widget-title">
                <Link to={slug.startsWith('/') ? slug : `/thoi-su/${slug}`}>{title}</Link>
            </h3>
            
            <div className="widget-first-item">
                <Link to={getDetailLink(firstItem.link)} className="widget-thumb">
                    <img src={extractImage(firstItem)} alt={firstItem.title} />
                </Link>
                <h4>
                    <Link to={getDetailLink(firstItem.link)}>{firstItem.title}</Link>
                </h4>
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

function Sidebar() {
    const [chinhTri, setChinhTri] = useState<RSSContent[]>([]);
    const [xaHoi, setXaHoi] = useState<RSSContent[]>([]);
    const [doThi, setDoThi] = useState<RSSContent[]>([]);
    const [chuyenThuongNgay, setChuyenThuongNgay] = useState<RSSContent[]>([]);

    const location = useLocation();
    const currentPath = location.pathname; 

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                // SỬA LỖI Ở ĐÂY: Đổi về "datafetch" để Backend hiểu được yêu cầu
                const [resCT, resXH, resDT, resCTN] = await Promise.all([
                    DataFetch<NewsItem[], Payload>(SERVER_LINK, { signal: "datafetch", datapage: "chinh-tri" }),
                    DataFetch<NewsItem[], Payload>(SERVER_LINK, { signal: "datafetch", datapage: "xa-hoi" }),
                    DataFetch<NewsItem[], Payload>(SERVER_LINK, { signal: "datafetch", datapage: "do-thi" }),
                    DataFetch<NewsItem[], Payload>(SERVER_LINK, { signal: "datafetch", datapage: "chuyen-thuong-ngay" })
                ]);

                if (resCT) setChinhTri(resCT.map(e => e.item));
                if (resXH) setXaHoi(resXH.map(e => e.item));
                if (resDT) setDoThi(resDT.map(e => e.item));
                if (resCTN) setChuyenThuongNgay(resCTN.map(e => e.item));
            } catch (error) {
                console.error("Lỗi tải sidebar:", error);
            }
        };
        fetchSidebarData();
    }, []);

    // Logic kiểm tra để ẩn mục đang xem
    // Kiểm tra currentPath có chứa slug không.
    // Ví dụ: đang ở /thoi-su/chinh-tri -> currentPath chứa 'chinh-tri' -> Ẩn Box Chính trị
    
    return (
        <div className="sidebar-container">
            { !currentPath.includes('chinh-tri') && (
                <CategoryWidget title="Chính trị" slug="chinh-tri" data={chinhTri} />
            )}
            
            { !currentPath.includes('xa-hoi') && (
                <CategoryWidget title="Xã hội" slug="xa-hoi" data={xaHoi} />
            )}
            
            { !currentPath.includes('do-thi') && (
                <CategoryWidget title="Đô thị" slug="do-thi" data={doThi} />
            )}

            { !currentPath.includes('chuyen-thuong-ngay') && (
                <CategoryWidget title="Chuyện thường ngày" slug="chuyen-thuong-ngay" data={chuyenThuongNgay} />
            )}
        </div>
    );
}

export default Sidebar;