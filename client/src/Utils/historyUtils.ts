// client/src/Utils/historyUtils.ts

export const addToViewedHistory = (article: any) => {
    if (!article || !article.link) return;

    // Lấy danh sách cũ từ LocalStorage
    let history = JSON.parse(localStorage.getItem("viewed_articles") || "[]");

    // Kiểm tra xem bài này đã có trong lịch sử chưa
    // Nếu có rồi thì xóa, rồi thêm vào đầu 
    const existingIndex = history.findIndex((item: any) => item.link === article.link);
    if (existingIndex !== -1) {
        history.splice(existingIndex, 1);
    }

    // Thêm bài mới vào ĐẦU danh sách
    const historyItem = {
        title: article.title,
        link: article.link,
        image: article.image || getImgSrc(article.content), 
        sapo: article.contentSnippet || article.sapo,
        time: new Date().toLocaleString()
    };
    
    history.unshift(historyItem);

    //lưu 50 bài gần nhất
    if (history.length > 50) {
        history = history.slice(0, 50);
    }

    //Lưu lại vào LocalStorage
    localStorage.setItem("viewed_articles", JSON.stringify(history));
};

// Hàm lấy ảnh 
const getImgSrc = (content: string | undefined): string => {
    const regex = /<img[^>]+src="([^">]+)"/;
    const match = (content || "").match(regex);
    return match ? match[1] : "https://static.nld.com.vn/image/logo.svg";
};