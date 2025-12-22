import cors from "cors";
import express, { Request, Response } from "express";
import RSSparser from "rss-parser";
import GetDetailArticle from "./function/GetDetailsOfArticle";

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

app.post('/', async (req: Request<{}, {}, RequestBody>, res: Response) => {
    const { signal } = req.body;

    if (signal === "datafetch") {
        const dataPage = req.body.datapage;
        let rssSlug = "";
        
        // CẬP NHẬT SLUG THEO ĐÚNG DANH SÁCH BẠN GỬI
        switch (dataPage) {
            case "home": rssSlug = "home"; break;        
            case "tin-moi": rssSlug = "home"; break; 
            case "thoi-su": rssSlug = "thoi-su"; break;
            case "quoc-te": rssSlug = "quoc-te"; break;
            case "lao-dong": rssSlug = "lao-dong"; break;
            case "ban-doc": rssSlug = "ban-doc"; break;
            case "net-zero": rssSlug = "net-zero"; break;
            case "kinh-te": rssSlug = "kinh-te"; break;
            case "suc-khoe": rssSlug = "suc-khoe"; break;
            case "giao-duc": rssSlug = "giao-duc-khoa-hoc"; break;
            case "phap-luat": rssSlug = "phap-luat"; break;
            case "van-hoa-van-nghe": rssSlug = "van-hoa-van-nghe"; break;
            case "giai-tri": rssSlug = "giai-tri"; break;
            case "the-thao": rssSlug = "the-thao"; break;
            case "ai-365": rssSlug = "ai-365"; break;
            case "phu-nu": rssSlug = "chuyen-trang-phu-nu"; break; // Đã sửa
            case "gia-dinh": rssSlug = "gia-dinh"; break;
            case "dia-oc": rssSlug = "dia-oc"; break;
            default: rssSlug = "home"; // Mặc định về home
        }

        const urlFeed = BASE_RSS_URL + rssSlug + ".rss";
        console.log(`Backend đang lấy: ${urlFeed}`); // Log để kiểm tra

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