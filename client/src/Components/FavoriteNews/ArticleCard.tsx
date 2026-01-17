import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toggleFavorite } from "./favorite";
import "./Favorite.css";

function ArticleCard({ article }: any) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

    const isFavorite =
        currentUser?.favorites?.some((f: any) => f.id === article.id);

    return (
        <div className="news-item">
            <div className="news-thumb">
                <Link to={article.detailLink}>
                    <img src={article.image} alt={article.title} />
                </Link>
            </div>

            <div className="news-content">
                <h3 className="news-title">
                    <Link to={article.detailLink}>{article.title}</Link>
                    <FaStar
                        className={`favorite-icon ${isFavorite ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(article);
                        }}
                    />
                </h3>

                <p className="news-sapo">{article.sapo}</p>
                <div className="news-meta">
                    <span>{article.pubDate}</span>
                </div>
            </div>
        </div>
    );
}

export default ArticleCard;
