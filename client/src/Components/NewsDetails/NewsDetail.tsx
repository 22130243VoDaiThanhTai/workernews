import parse, { domToReact, Element } from "html-react-parser";
import React, { useEffect, useState } from "react";
import { FaFacebookF, FaPrint, FaLink, FaBookmark, FaFont, FaThumbsUp } from "react-icons/fa";
import { SiZalo } from "react-icons/si"; 
import { useLocation, Link } from 'react-router-dom';
import GetDetailArticle, { ArticleDetail } from "../fetchRSS/GetDetailArticle";
import "./NewsDetail.css";
import SpeechPlayer from "../SpeechPlayer/SpeechPlayer";
import { addToViewedHistory } from '../../Utils/historyUtils';

const SERVER_LINK = "http://localhost:4000";

function NewsDetail() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const link = params.get('link');

  const [detail, setDetail] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!link) return;
      try {
        setLoading(true);
        setDetail(null); 
        const data = await GetDetailArticle(SERVER_LINK, link);
        setDetail(data);
      } catch (err) {
        console.error("Lỗi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [link]); 

  // Lưu vào lịch sử khi có dữ liệu (detail)
  useEffect(() => {
    if (detail && link) {
      // Chuẩn bị object để lưu
      const itemToSave = {
        title: detail.title,           // Tiêu đề
        link: link,                    // Link gốc
        content: detail.content,       // Dùng để trích xuất ảnh thumbnail
        sapo: detail.category || "Tin tức", // Dùng category làm sapo tạm nếu không có sapo riêng
        // Nếu API trả về sapo/contentSnippet riêng thì dùng: detail.sapo 
      };

      // lưu
      addToViewedHistory(itemToSave);
    }
  }, [detail, link]); // Chạy mỗi khi detail hoặc link thay đổi

  const parseOptions = {
    replace: (domNode: any) => {
    
        if (domNode.name === 'a' && domNode.attribs && domNode.attribs.href) {
            const originalLink = domNode.attribs.href;
            
            if (originalLink.includes('nld.com.vn') || originalLink.startsWith('/')) {
               
                let fullLink = originalLink;
                if(originalLink.startsWith('/')) {
                    fullLink = `https://nld.com.vn${originalLink}`;
                }

                return (
                    <Link 
                        to={`/detail-article?link=${encodeURIComponent(fullLink)}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        className={domNode.attribs.class} // Giữ lại class CSS cũ
                    >
                        {domToReact(domNode.children, parseOptions)}
                    </Link>
                );
            }
        }
    }
  };

  if (loading) return <div className="detail-loading">Đang tải dữ liệu...</div>;
  if (!detail) return <div className="detail-error">Không tìm thấy nội dung bài viết.</div>;

  return (
    <div className="nld-page-wrapper">

      <div className="left-sticky-col">
        <div className="toolbar-container">
            <button className="tool-btn fb" title="Chia sẻ Facebook"><FaFacebookF /></button>
            <button className="tool-btn zalo" title="Chia sẻ Zalo"><SiZalo /></button>
            <button className="tool-btn link"><FaLink /></button>
            <button className="tool-btn print"><FaPrint /></button>
            <button className="tool-btn bookmark"><FaBookmark /></button>
            <div className="tool-separator"></div>
            <button className="tool-btn font"><FaFont /></button>
        </div>
      </div>

      <div className="nld-main-content">
        <div className="article-top-cat">{detail.category || "Tin tức"}</div>
        <h1 className="article-main-title">{detail.title ? parse(detail.title) : ""}</h1>

        <div className="article-meta-row">
            <div className="meta-left">
                <span className="meta-author">{detail.author || "Người Lao Động"}</span>
            </div>
            <div className="meta-right">
                <span className="meta-date">{detail.date}</span>
            </div>
        </div>

        <div 
            className="action-bar-container" 
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '355px', 
                marginBottom: '15px',
                marginTop: '10px'
            }}
        >
            <div className="audio-wrapper" style={{ flexShrink: 0 }}> 
                {detail.content && <SpeechPlayer text={detail.content} />}
            </div>

            <div className="social-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="fb-like-wrapper">
                    <button className="fb-btn-real like">
                        <FaThumbsUp className="fb-icon-thumb"/> 
                        <span>Thích</span>
                    </button>
                    <span className="fb-count-bubble">12</span>
                </div>
                
                <button className="fb-btn-real share">Chia sẻ</button>
            </div>
        </div>
        

        <div className="article-content-body">
            {/* Sapo in đậm + Áp dụng parseOptions */}
            {parse(detail.content.replace(/(\(NLĐO\).*?)(-)/, '<span class="sapo-bold">$1$2</span>'), parseOptions)}
        </div>
      </div>
      
    </div>
  );
}

export default NewsDetail;