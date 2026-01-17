import React, { useEffect, useState } from "react";
import ArticleCard from "../Components/FavoriteNews/ArticleCard";

function FavoritePage() {
    const [favorites, setFavorites] = useState<any[]>([]);

    useEffect(() => {
        const currentUser = JSON.parse(
            localStorage.getItem("currentUser") || "null"
        );

        if (currentUser?.favorites) {
            setFavorites(currentUser.favorites);
        }
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Tin yêu thích</h1>

            {favorites.length === 0 ? (
                <p>Bạn chưa lưu tin nào.</p>
            ) : (
                favorites.map((article, index) => (
                    <ArticleCard key={index} article={article} />
                ))
            )}
        </div>
    );
}

export default FavoritePage;
