export const toggleFavorite = (article: any) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) {
        alert("Bạn cần đăng nhập để lưu tin yêu thích");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    const isExist = currentUser.favorites.find(
        (item: any) => item.id === article.id
    );

    if (isExist) {
        currentUser.favorites = currentUser.favorites.filter(
            (item: any) => item.id !== article.id
        );
        alert("Đã bỏ khỏi tin yêu thích");
    } else {
        currentUser.favorites.push(article);
        alert("Đã lưu tin vào mục yêu thích");
    }


    // update lại user trong users
    users = users.map((u: any) =>
        u.id === currentUser.id ? currentUser : u
    );

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
};
