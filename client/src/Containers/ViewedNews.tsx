import React, { useEffect, useState } from "react";
import ArticleCard from "../Components/FavoriteNews/ArticleCard";
import "./ViewedNews.css"; 

function ViewedNews() {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem("viewed_articles") || "[]");
        setHistory(storedHistory);
    }, []);

    const clearHistory = () => {
        if (window.confirm("Bạn có chắc muốn xóa toàn bộ lịch sử đọc tin?")) {
            localStorage.removeItem("viewed_articles");
            setHistory([]);
        }
    };

    return (
        <div className="viewed-page-container">
            
            <div className="viewed-header">
                <h1 className="page-heading">Tin đã xem</h1>
                
                {history.length > 0 && (
                    <button className="btn-clear-history" onClick={clearHistory}>
                        🗑 Xóa lịch sử
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="empty-history">
                    <p>Bạn chưa xem tin nào gần đây.</p>
                </div>
            ) : (
                <div className="viewed-list">
                    {history.map((article, index) => (
                        <ArticleCard key={index} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ViewedNews;