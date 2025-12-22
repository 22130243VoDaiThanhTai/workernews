import DataFetch from "./DataFetch";

interface ArticleRequestPayload {
    signal: "detailarticle"; 
    articlepage: string;     
}

export interface ArticleDetail {
    title: string;
    content: string;   
    author: string;
    category: string;
    date: string;

    description?: string; 
    link?: string;
    thumbnail?: string;
}


const GetDetailArticle = async (serverLink: string, guid: string): Promise<ArticleDetail> => {
    try {
        const payload: ArticleRequestPayload = { 
            signal: "detailarticle", 
            articlepage: guid 
        };

        // Gọi DataFetch với cú pháp Generic <Kiểu_Trả_Về, Kiểu_Gửi_Đi>
        // Lúc này TS sẽ hiểu detailData chắc chắn có cấu trúc ArticleDetail
        const detailData = await DataFetch<ArticleDetail, ArticleRequestPayload>(serverLink, payload);
        
        return detailData;
    } catch (error) {
        console.error('Error fetching article detail:', error);
        throw error; 
    }
};

export default GetDetailArticle;