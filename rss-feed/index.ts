import cors from "cors";
import express, { Request, Response } from "express";
import RSSparser from "rss-parser";
import GetDetailArticle from "./function/GetDetailsOfArticle";
import axios from "axios";
import { parseStringPromise } from "xml2js";

const BASE_RSS_URL = "https://nld.com.vn/rss/";
const parser = new RSSparser();

interface RequestBody {
    signal: "datafetch" | "detailarticle";
    datapage?: string;
    articlepage?: string;
}

interface RSSItem {
    item: RSSparser.Item;
}

const parse = async (url: string): Promise<RSSItem[]> => {
    try {
        const feed = await parser.parseURL(url);
        const results: RSSItem[] = [];
        feed.items.forEach(item => {
            results.push({ item });
        });
        return results;
    } catch (e) {
        console.log(`Lỗi parse RSS (${url}):`, e);
        return [];
    }
}

const app = express();
app.use(cors());
app.use(express.json());
// Cấu hình Header giả lập trình duyệt để không bị chặn
const AXIOS_CONFIG = {
    headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
};
// Hàm lấy Tỷ giá từ Vietcombank
const fetchExchangeRates = async () => {
    try {
        // Thêm User-Agent để không bị Vietcombank chặn
        const response = await axios.get("https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx", {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        
        const result = await parseStringPromise(response.data);
        const exrates = result.ExrateList.Exrate;

        const getRate = (code: string) => {
            const item = exrates.find((x: any) => x.$.CurrencyCode === code);
            return item ? { buy: item.$.Buy, sell: item.$.Sell } : { buy: "---", sell: "---" };
        };

        return {
            USD: getRate("USD"),
            EUR: getRate("EUR"),
            // Giá vàng SJC thường không có trong XML này, ta giả lập hoặc lấy nguồn khác. 
            // Tạm thời fix cứng giá SJC tham khảo hoặc để trống
            SJC: { buy: "74,000,000", sell: "76,500,000" } 
        };
    } catch (error) {
        console.error("Lỗi lấy tỷ giá:", error);
        return null;
    }
};

// 2. HÀM LẤY VIETLOTT (XSKT.COM.VN) 
const fetchRealVietlott = async () => {
    try {
        // Dùng axios lấy XML raw trước để tránh bị chặn
        const response = await axios.get("https://xskt.com.vn/rss-feed/vietlott-power-6-55.rss", AXIOS_CONFIG);
        
        // Parse string XML vừa lấy được
        const feed = await parser.parseString(response.data);
        
        if (feed.items.length > 0) {
            const item = feed.items[0];
            const title = item.title || ""; 
            const content = item.contentSnippet || item.content || "";

            // --- XỬ LÝ DỮ LIỆU ---
            
            // 1. Ngày quay: Lấy từ tiêu đề (vd: "Kết quả... ngày 16/01/2025")
            const dateMatch = title.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/);
            const drawDate = dateMatch ? dateMatch[0] : (new Date().toLocaleDateString('vi-VN'));

            // 2. Dãy số: Tìm chuỗi dạng "08 15 22 36 45 52"
            // Regex: Tìm 6 cặp số (2 chữ số) cách nhau bằng khoảng trắng
            const numberRegex = /\b\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}\b/;
            const numberMatch = content.match(numberRegex);
            
            // 3. Số đặc biệt (Jackpot 2): Thường nằm sau dấu gạch ngang hoặc ký hiệu phân cách
            // Ví dụ content: "... : 01 02 03 04 05 06 - 07 ..."
            const specialMatch = content.match(/-\s*(\d{2})/);

            // 4. Giá trị Jackpot
            const jackpotMatch = content.match(/Jackpot 1: ([0-9,.]+) đồng/) || content.match(/đặc biệt: ([0-9,.]+) đồng/);

            if (numberMatch) {
                const numberStr = numberMatch[0];
                const numbers = numberStr.split(/\s+/).map(n => parseInt(n));
                
                // Nếu tìm thấy số đặc biệt thì dùng, không thì random (fallback)
                const special = specialMatch ? parseInt(specialMatch[1]) : Math.floor(Math.random() * 55) + 1;

                return {
                    numbers: numbers, // Mảng 6 số chính
                    special: special, // Số đặc biệt (vàng)
                    date: drawDate,
                    jackpot: jackpotMatch ? jackpotMatch[1] : "Đang cập nhật"
                };
            }
        }
        return null;
    } catch (error) {
        console.error("Lỗi Vietlott RSS:", error);
        return null;
    }
}

app.post('/', async (req: Request<{}, {}, RequestBody>, res: Response) => {
    const { signal } = req.body;

    if (signal === "datafetch") {
        const dataPage = req.body.datapage;

        // --- API TỶ GIÁ ---
        if (dataPage === "exchange-rate") {
            const rates = await fetchExchangeRates();
            res.send(rates);
            return;
        }
        // --- API VIETLOTT ---
        if (dataPage === "vietlott-real") {
            const lotto = await fetchRealVietlott();
            res.send(lotto);
            return;
        }
        let rssSlug = "";
        
        switch (dataPage) {
            case "home": rssSlug = "home"; break;        
            case "tin-moi": rssSlug = "home"; break; 
            
            // --- CÁC MỤC TRONG THỜI SỰ ---
            case "thoi-su": rssSlug = "thoi-su"; break;
            case "chinh-tri": rssSlug = "thoi-su/chinh-tri"; break;
            case "xa-hoi": rssSlug = "thoi-su/xa-hoi"; break;
            case "do-thi": rssSlug = "thoi-su/do-thi"; break;
            case "chuyen-thuong-ngay": rssSlug = "thoi-su/chuyen-thuong-ngay-o-phuong-xa"; break;
            case "bien-dao": rssSlug = "bien-dao"; break;

           // --- QUỐC TẾ
            case "quoc-te": rssSlug = "quoc-te"; break;
            case "nguoi-viet-do-day": rssSlug = "quoc-te/nguoi-viet-do-day"; break; 
            case "hay-la": rssSlug = "quoc-te/hay-la"; break; 
            case "van-de-nong": rssSlug = "quoc-te/van-de-nong"; break;
            case "ho-so": rssSlug = "quoc-te/ho-so"; break;
            case "quan-su-quoc-phong": rssSlug = "quoc-te/quan-su-quoc-phong"; break;
            case "khoa-hoc": rssSlug = "khoa-hoc"; break;

            case "lao-dong": rssSlug = "lao-dong"; break;
            case "cong-doan-cong-nhan": rssSlug = "lao-dong/cong-doan-cong-nhan"; break;
            case "viec-lam": rssSlug = "lao-dong/viec-lam"; break;
            case "an-sinh-xa-hoi": rssSlug = "lao-dong/an-sinh-xa-hoi"; break; 
            case "chinh-sach": rssSlug = "lao-dong/chinh-sach"; break; 
            case "xuat-khau-lao-dong": rssSlug = "lao-dong/xuat-khau-lao-dong"; break; 
            

            case "ban-doc": rssSlug = "ban-doc"; break;
            case "nha-o-xa-hoi": rssSlug = "ban-doc/nha-o-xa-hoi"; break;
            case "toi-len-tieng": rssSlug = "ban-doc/toi-len-tieng"; break;
            case "goc-anh-ban-doc": rssSlug = "ban-doc/goc-anh-ban-doc"; break;
            case "cuoc-song-nhan-ai": rssSlug = "ban-doc/cuoc-song-nhan-ai"; break;
            case "thu-ban-doc": rssSlug = "ban-doc/thu-ban-doc"; break;

            case "net-zero": rssSlug = "net-zero"; break;
            case "tin-tuc-xu-huong": rssSlug = "net-zero/tin-tuc-xu-huong"; break;
            case "chuyen-doi-xanh": rssSlug = "net-zero/chuyen-doi-xanh"; break;
            case "song-xanh": rssSlug = "net-zero/song-xanh"; break;
            case "cam-nang": rssSlug = "net-zero/cam-nang"; break;

            case "kinh-te": rssSlug = "kinh-te"; break;
            case "kinh-doanh": rssSlug = "kinh-te/kinh-doanh"; break;
            case "tieu-dung": rssSlug = "kinh-te/tieu-dung"; break;
            case "oto-xe-dien-may": rssSlug = "kinh-te/oto-xe-dien-may"; break;
            case "bat-dong-san": rssSlug = "kinh-te/bat-dong-san"; break;
            case "tai-chinh-chung-khoan": rssSlug = "kinh-te/tai-chinh-chung-khoan"; break;
            case "dien-dan-kinh-te": rssSlug = "kinh-te/dien-dan-kinh-te"; break;

            case "suc-khoe": rssSlug = "suc-khoe"; break;
            case "chuyen-dong-y-hoc": rssSlug = "suc-khoe/chuyen-dong-y-hoc"; break;
            case "gioi-tinh": rssSlug = "suc-khoe/gioi-tinh"; break;
            case "bac-si-cua-ban": rssSlug = "suc-khoe/bac-si-cua-ban"; break;
            case "khoe-va-dep": rssSlug = "suc-khoe/khoe-dep"; break;
            
            case "giao-duc": rssSlug = "giao-duc-khoa-hoc"; break;
            case "du-hoc": rssSlug = "giao-duc-khoa-hoc/du-hoc"; break;
            case "tuyen-sinh": rssSlug = "giao-duc-khoa-hoc/tuyen-sinh"; break;
            case "sau-buc-giang": rssSlug = "giao-duc-khoa-hoc/sau-buc-giang"; break;

            case "phap-luat": rssSlug = "phap-luat"; break;
            case "luat-su-cua-ban": rssSlug = "phap-luat/luat-su-cua-ban"; break;
            case "truy-na": rssSlug = "phap-luat/truy-na"; break; 
            case "chuyen-phap-dinh": rssSlug = "phap-luat/chuyen-phap-dinh"; break; 

            case "van-hoa-van-nghe": rssSlug = "van-hoa-van-nghe"; break;
            case "am-nhac": rssSlug = "van-hoa-van-nghe/am-nhac"; break;
            case "van-hoc": rssSlug = "van-hoa-van-nghe/van-hoc"; break;
            case "dien-anh": rssSlug = "van-hoa-van-nghe/dien-anh"; break;
            case "san-khau": rssSlug = "van-hoa-van-nghe/san-khau"; break;
            case "nghe-xem-doc-gi": rssSlug = "van-hoa-van-nghe/nghe-xem-doc-gi"; break;

            case "giai-tri": rssSlug = "giai-tri"; break;
            case "hau-truong-showbiz": rssSlug = "giai-tri/hau-truong-showbiz"; break;
            case "chuyen-cua-sao": rssSlug = "giai-tri/chuyen-cua-sao"; break;
            
            case "the-thao": rssSlug = "the-thao"; break;
            case "bong-da": rssSlug = "the-thao/bong-da"; break;
            case "golf": rssSlug = "the-thao/golf"; break;
            case "hau-truong": rssSlug = "the-thao/hau-truong"; break;
            case "tennis": rssSlug = "the-thao/tennis"; break;
            case "marathon": rssSlug = "the-thao/marathon"; break; 
            case "cac-mon-khac": rssSlug = "the-thao/cac-mon-khac"; break;

            case "ai-365": rssSlug = "ai-365"; break;
            case "cong-nghe-so": rssSlug = "ai-365/cong-nghe-so"; break;
            case "bao-mat": rssSlug = "ai-365/bao-mat"; break;
            case "mang-xa-hoi": rssSlug = "ai-365/mang-xa-hoi"; break;
            case "giai-tri-cung-ai": rssSlug = "ai-365/giai-tri-cung-ai"; break;

            case "du-lich-xanh": rssSlug = "du-lich-xanh"; break;
            case "tieu-diem": rssSlug = "du-lich-xanh/tieu-diem"; break;
            case "diem-den": rssSlug = "du-lich-xanh/diem-den"; break;
            case "am-thuc": rssSlug = "du-lich-xanh/am-thuc"; break;
            case "dung-bo-lo": rssSlug = "du-lich-xanh/dung-bo-lo"; break;

            // case "phu-nu": rssSlug = "chuyen-trang-phu-nu"; break;
            // case "khoe-dep": rssSlug = "chuyen-trang-phu-nu/khoe-dep"; break;
            // case "tam-su": rssSlug = "chuyen-trang-phu-nu/tam-su"; break;
            // case "chuyen-cua-sao-pn": rssSlug = "chuyen-trang-phu-nu/chuyen-cua-sao"; break; 
            // case "mon-ngon": rssSlug = "chuyen-trang-phu-nu/mon-ngon"; break;
            // case "diem-den-pn": rssSlug = "chuyen-trang-phu-nu/diem-den"; break; 
            // case "tieu-dung-thong-minh": rssSlug = "chuyen-trang-phu-nu/tieu-dung-thong-minh"; break;
            // case "ban-linh-song": rssSlug = "chuyen-trang-phu-nu/ban-linh-song"; break;

            case "gia-dinh": rssSlug = "gia-dinh"; break;
            case "khong-gian-song": rssSlug = "gia-dinh/khong-gian-song"; break;
            case "cha-me-va-con-cai": rssSlug = "gia-dinh/cha-me-va-con-cai"; break;
            case "bi-quyet-lam-dep": rssSlug = "gia-dinh/bi-quyet-lam-dep"; break;
            
            // case "dia-oc": rssSlug = "dia-oc"; break;
            // case "du-an": rssSlug = "dia-oc/du-an"; break;
            // case "thi-truong-dia-oc": rssSlug = "dia-oc/thi-truong"; break;
            // case "nha-dep": rssSlug = "dia-oc/nha-dep"; break;
            // case "doanh-nhan": rssSlug = "dia-oc/doanh-nhan"; break;
            // case "so-hoa": rssSlug = "dia-oc/so-hoa"; break;
            // case "vat-tu": rssSlug = "dia-oc/vat-tu"; break;
            // case "tai-chinh": rssSlug = "dia-oc/tai-chinh"; break;

            case "ly-tuong-song": rssSlug = "ly-tuong-song"; break;
            case "noi-thang": rssSlug = "noi-thang"; break;
            case "doc-quyen": rssSlug = "doc-quyen"; break;

            case "tin-24h": rssSlug = "home"; break;
            case "dai-hoi-dang": rssSlug = "dai-hoi-dang"; break;
            case "tin-tuc-su-kien": rssSlug = "dai-hoi-dang/tin-tuc-su-kien"; break;
            case "van-kien-nghi-quyet": rssSlug = "dai-hoi-dang/van-kien-nghi-quyet"; break;
            case "nhan-su-chan-dung": rssSlug = "dai-hoi-dang/nhan-su-chan-dung"; break;
            case "thong-diep-tu-lanh-dao": rssSlug = "dai-hoi-dang/thong-diep-tu-lanh-dao"; break;
            case "dien-dan-y-kien": rssSlug = "dai-hoi-dang/dien-dan-y-kien"; break;
            
            case "danh-cho-ban-doc-vip": rssSlug = "danh-cho-ban-doc-vip"; break;
            case "english-news": rssSlug = "nguoi-lao-dong-news"; break;
            case "podcast": rssSlug = "podcast"; break;
            case "tu-hao-co-to-quoc": rssSlug = "tu-hao-co-to-quoc"; break;
            default: rssSlug = "home"; 
        }

        const urlFeed = BASE_RSS_URL + rssSlug + ".rss";
        console.log(`Backend đang lấy: ${urlFeed} (Page: ${dataPage})`);

        try {
            const data = await parse(urlFeed);
            res.send(data);
        } catch (error) {
            res.status(500).send("Error parsing NLD feed");
        }
    } else if (signal === "detailarticle") {
        try {
            const articlePage = req.body.articlepage;
            if (!articlePage) {
                res.status(400).send("Missing articlepage URL");
                return;
            }
            const detailArticle = await GetDetailArticle(articlePage);
            res.send(detailArticle);
        } catch (error) {
            res.status(500).send("Error data article false");
        }
    } else {
        res.status(400).send("Invalid signal");
    }
})

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server NLD is listening at http://localhost:${PORT}`)
});