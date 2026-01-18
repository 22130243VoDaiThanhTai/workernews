import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Favorite.css"; 

function ArticleCard({ article }: any) {
    // Dùng state để giao diện tự render lại khi click
    const [isFav, setIsFav] = useState(false);

    // ưu tiên lấy link nào tồn tại.
    const rawLink = article.link || article.detailLink;
    
    // Tạo đường dẫn chi tiết chuẩn
    const detailUrl = rawLink 
        ? `/detail-article?link=${encodeURIComponent(rawLink)}` 
        : "#";

    const safeImage = article.image || "https://static.nld.com.vn/image/logo.svg";

    // Kiểm tra trạng thái khi load bài
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        if (currentUser && currentUser.favorites) {
            // So sánh bằng LINK 
            const exists = currentUser.favorites.some((f: any) => 
                (f.link === rawLink) || (f.detailLink === rawLink)
            );
            setIsFav(!!exists);
        }
    }, [rawLink]);

    //HÀM XỬ LÝ CLICK
    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault(); // Chặn click vào bài báo
        e.stopPropagation();

        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        // Nếu chưa đăng nhập
        if (!currentUser) {
            alert("Bạn cần đăng nhập để lưu tin!");
            return;
        }

        let favList = currentUser.favorites || [];

        if (isFav) {
            // Đang thích -> Xóa đi
            favList = favList.filter((f: any) => 
                f.link !== rawLink && f.detailLink !== rawLink
            );
            setIsFav(false);
            // alert("Đã bỏ lưu tin"); 
        } else {

            // Chưa thích -> Thêm vào
            // Chuẩn hóa object để lưu thống nhất
            const newFavItem = {
                ...article,
                link: rawLink, // Luôn đảm bảo có trường link
                detailLink: rawLink // Lưu cả 2 để tương thích ngược
            };
            favList.push(newFavItem);
            setIsFav(true);
            // alert("Đã lưu tin");
        }

        // Lưu lại LocalStorage
        currentUser.favorites = favList;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        // Cập nhật mảng users tổng 
        let users = JSON.parse(localStorage.getItem("users") || "[]");
        users = users.map((u: any) => u.id === currentUser.id ? currentUser : u);
        localStorage.setItem("users", JSON.stringify(users));
    };

    return (
        <div className="news-item">
            <div className="news-thumb">
                <Link to={detailUrl}>
                    <img src={safeImage} alt={article.title} />
                </Link>
            </div>

            <div className="news-content">
                <h3 className="news-title">
                    <Link to={detailUrl} title={article.title}>
                        {article.title}
                    </Link>

                    <FaStar
                        className={`favorite-icon ${isFav ? "active" : ""}`}
                        onClick={handleToggleFavorite}
                        title={isFav ? "Bỏ lưu tin" : "Lưu tin này"}
                        style={{ 
                            marginLeft: '8px', 
                            cursor: 'pointer', 
                            color: isFav ? 'gold' : '#ccc',
                            transition: 'color 0.2s'
                        }}
                    />
                </h3>

                {/* Kiểm tra sapo có bị null không trước khi render */}
                <p className="news-sapo">
                    {article.sapo || article.contentSnippet || ""}
                </p>
                
                <div className="news-meta">
                    <span>{article.pubDate || "Vừa cập nhật"}</span>
                </div>
            </div>
        </div>
    );
}

export default ArticleCard;