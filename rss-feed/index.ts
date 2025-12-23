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
            case "kinh-te": rssSlug = "kinh-te"; break;
            case "suc-khoe": rssSlug = "suc-khoe"; break;
            case "giao-duc": rssSlug = "giao-duc-khoa-hoc"; break;
            case "phap-luat": rssSlug = "phap-luat"; break;
            case "van-hoa-van-nghe": rssSlug = "van-hoa-van-nghe"; break;
            case "giai-tri": rssSlug = "giai-tri"; break;
            case "the-thao": rssSlug = "the-thao"; break;
            case "ai-365": rssSlug = "ai-365"; break;
            case "phu-nu": rssSlug = "chuyen-trang-phu-nu"; break;
            case "gia-dinh": rssSlug = "gia-dinh"; break;
            case "dia-oc": rssSlug = "dia-oc"; break;
            
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