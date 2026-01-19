// client/src/Utils/historyUtils.ts

export const addToViewedHistory = (article: any) => {
    if (!article || !article.link) return;

    // CHECK LOGIN
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) return; //chưa login → không lưu

    const storageKey = `viewed_articles_${currentUser.id}`;

    let history = JSON.parse(localStorage.getItem(storageKey) || "[]");
    // Kiểm tra xem bài này đã có trong lịch sử chưa
    // Nếu có rồi thì xóa, rồi thêm vào đầu
    const existingIndex = history.findIndex(
        (item: any) => item.link === article.link
    );
    if (existingIndex !== -1) {
        history.splice(existingIndex, 1);
    }

    const historyItem = {
        title: article.title,
        link: article.link,
        image: article.image || getImgSrc(article.content),
        sapo: article.contentSnippet || article.sapo,
        time: new Date().toLocaleString()
    };

    history.unshift(historyItem);

    if (history.length > 50) {
        history = history.slice(0, 50);
    }

    localStorage.setItem(storageKey, JSON.stringify(history));
};

const getImgSrc = (content: string | undefined): string => {
    const regex = /<img[^>]+src="([^">]+)"/;
    const match = (content || "").match(regex);
    return match ? match[1] : "https://static.nld.com.vn/image/logo.svg";
};