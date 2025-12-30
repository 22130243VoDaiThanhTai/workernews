import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export interface ArticleDetail {
    author: string;
    category: string;
    content: string;
    title: string;
    date: string;
}

interface JsonLD {
    '@type': string;
    headline?: string;
    datePublished?: string;
    author?: { name: string };
    articleBody?: string;
    itemListElement?: Array<{ position: number; item: { name: string } }>;
}

const GetDetailArticle = async (url: string): Promise<ArticleDetail | null> => {
    try {
        console.log("Đang lấy chi tiết bài:", url); // Log kiểm tra URL

        const response = await fetch(url);
        const html = await response.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // ---  LẤY SAPO ---
        // Danh sách các class mà NLD dùng cho Sapo ở các chuyên mục khác nhau
        const sapoSelectors = [
            '.sapo-content', 
            '.sapo-detail', 
            '.sapo', 
            '.content-sapo', 
            'h2.sapo', 
            '.detail-sapo'
        ];

        let sapoElement = null;
        for (const selector of sapoSelectors) {
            sapoElement = doc.querySelector(selector);
            if (sapoElement) {
                console.log(`=> Đã tìm thấy Sapo bằng selector: ${selector}`);
                break; // Tìm thấy thì dừng
            }
        }

        let sapoHtml = '';
        if (sapoElement) {
            // Đôi khi Sapo chứa cả link hoặc style rác, giữ nguyên thẻ nhưng có thể xử lý nếu cần
            sapoHtml = `<div class="sapo-wrapper" style="font-weight:bold; margin-bottom:15px; font-size: 1.1em;">
                            ${sapoElement.innerHTML}
                        </div>`;
        } else {
            console.log("=> KHÔNG tìm thấy Sapo nào!");
        }

        // ---  LẤY NỘI DUNG CHÍNH ---
        const bodyElement = doc.querySelector('.content-news-detail') 
                         || doc.querySelector('.detail-content')
                         || doc.querySelector('.news-content');

        if (bodyElement) {
            // Xóa rác
            const removeSelectors = 'script, .ad-content, .exp_content, .box-tin-lien-quan-ngang';
            const scripts = bodyElement.querySelectorAll(removeSelectors);
            scripts.forEach(script => script.remove());
        }
        
        const bodyHtml = bodyElement ? bodyElement.outerHTML : '';

        // --- GỘP: SAPO LÊN TRƯỚC BODY ---
        const fullContent = sapoHtml + bodyHtml;

        // ---  CÁC THÔNG TIN KHÁC ---
        let title = doc.querySelector('h1.title-content')?.textContent?.trim() || 
                    doc.querySelector('h1')?.textContent?.trim() || '';

        let date = doc.querySelector('.date-time')?.textContent?.trim() || 
                   doc.querySelector('.header-content .date')?.textContent?.trim() || '';

        let authorName = 'Người Lao Động';
        let category = 'Tin tức';
        
        // JSON-LD Logic
        const jsonScripts = doc.querySelectorAll('script[type="application/ld+json"]');
        for (const script of jsonScripts) {
            try {
                if (script.textContent) {
                    const jsonContent = JSON.parse(script.textContent.trim()) as JsonLD;
                    if (jsonContent['@type'] === 'NewsArticle') {
                        if (jsonContent.author && jsonContent.author.name) authorName = jsonContent.author.name;
                        if (!title && jsonContent.headline) title = jsonContent.headline;
                        if (!date && jsonContent.datePublished) {
                            const d = new Date(jsonContent.datePublished);
                            date = d.toLocaleString('vi-VN');
                        }
                    }
                    if (jsonContent['@type'] === 'BreadcrumbList' && jsonContent.itemListElement) {
                        const item = jsonContent.itemListElement.find(i => i.position === 2);
                        if (item) category = item.item.name;
                    }
                }
            } catch (e) {}
        }

        if (authorName === 'Người Lao Động') {
            const authorEl = doc.querySelector('.author-info .name') || doc.querySelector('.nguon-tin');
            if (authorEl && authorEl.textContent) authorName = authorEl.textContent.trim();
        }

        return {
            author: authorName,
            category: category,
            content: fullContent,
            title: title,
            date: date
        };
    } catch (error) {
        console.error('Error fetching NLD:', error);
        return null;
    }
};

export default GetDetailArticle;