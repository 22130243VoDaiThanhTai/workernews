// tái cấu trúc, muốn thêm trang mới trong danh mục (ví dụ Lao động, Kinh tế...) 
// chỉ cần sửa file này mà không cần tạo thêm component.

export interface CategoryConfig {
    title: string;       
    basePath: string;    
    rssSlug: string;     
    subMenu: {           
        label: string;
        path: string;    
    }[];
    sidebarWidgets: {    
        title: string;
        rssSlug: string; 
        linkSlug: string; 
    }[];
}

const MENU_CONFIG: Record<string, CategoryConfig> = {
    //  THỜI SỰ
    "thoi-su": {
        title: "Thời sự",
        basePath: "/thoi-su",
        rssSlug: "thoi-su",
        subMenu: [
            { label: "Chính trị", path: "chinh-tri" },
            { label: "Xã hội", path: "xa-hoi" },
            { label: "Đô thị", path: "do-thi" },
            { label: "Chuyện thường ngày", path: "chuyen-thuong-ngay" },
            { label: "Biển đảo", path: "/bien-dao" } 
        ],
        sidebarWidgets: [
            { title: "Chính trị", rssSlug: "chinh-tri", linkSlug: "chinh-tri" },
            { title: "Xã hội", rssSlug: "xa-hoi", linkSlug: "xa-hoi" },
            { title: "Đô thị", rssSlug: "do-thi", linkSlug: "do-thi" },
            { title: "Chuyện thường ngày", rssSlug: "chuyen-thuong-ngay", linkSlug: "chuyen-thuong-ngay" }
        ]
    },

    //  QUỐC TẾ
    "quoc-te": {
        title: "Quốc tế",
        basePath: "/quoc-te",
        rssSlug: "quoc-te",
        subMenu: [
            { label: "Người Việt đó đây", path: "nguoi-viet-do-day" },
            { label: "Hay - lạ", path: "hay-la" }, 
            { label: "Vấn đề nóng", path: "van-de-nong" },
            { label: "Hồ sơ", path: "ho-so" },
            { label: "Quân sự - Quốc phòng", path: "quan-su-quoc-phong" },
            { label: "Khoa học", path: "/khoa-hoc" }
        ],
        sidebarWidgets: [
            { title: "Người Việt đó đây", rssSlug: "nguoi-viet-do-day", linkSlug: "nguoi-viet-do-day" },
            { title: "Hay - lạ", rssSlug: "hay-la", linkSlug: "hay-la" }, 
            { title: "Vấn đề nóng", rssSlug: "van-de-nong", linkSlug: "van-de-nong" },
            { title: "Hồ sơ", rssSlug: "ho-so", linkSlug: "ho-so" },
            { title: "Quân sự - Quốc phòng", rssSlug: "quan-su-quoc-phong", linkSlug: "quan-su-quoc-phong" }
        ]
    },

    // CÁC TRANG KHÁC
    "bien-dao": {
        title: "Biển đảo",
        basePath: "/bien-dao",
        rssSlug: "bien-dao",
        subMenu: [],       
        sidebarWidgets: [] 
    },
    "khoa-hoc": {
        title: "Khoa học",
        basePath: "/khoa-hoc",
        rssSlug: "khoa-hoc",
        subMenu: [],
        sidebarWidgets: []
    },
    "lao-dong": {
        title: "Lao động",
        basePath: "/lao-dong",
        rssSlug: "lao-dong",
        subMenu: [
            { label: "Công đoàn - Công nhân", path: "cong-doan-cong-nhan" },
            { label: "Việc làm", path: "viec-lam" },
            { label: "An sinh xã hội", path: "an-sinh-xa-hoi" },
            { label: "Chính sách", path: "chinh-sach" },
            { label: "Xuất khẩu lao động", path: "xuat-khau-lao-dong" }
        ],
        sidebarWidgets: [
            { title: "Công đoàn - Công nhân", rssSlug: "cong-doan-cong-nhan", linkSlug: "cong-doan-cong-nhan" },
            { title: "Việc làm", rssSlug: "viec-lam", linkSlug: "viec-lam" },
            { title: "An sinh xã hội", rssSlug: "an-sinh-xa-hoi", linkSlug: "an-sinh-xa-hoi" },
            { title: "Chính sách", rssSlug: "chinh-sach", linkSlug: "chinh-sach" },
            { title: "Xuất khẩu lao động", rssSlug: "xuat-khau-lao-dong", linkSlug: "xuat-khau-lao-dong" }
        ]
    },
    "ban-doc": {
        title: "Bạn đọc",
        basePath: "/ban-doc",
        rssSlug: "ban-doc",
        subMenu: [
            { label: "Nhà ở xã hội", path: "nha-o-xa-hoi" },
            { label: "Tôi lên tiếng", path: "toi-len-tieng" },
            { label: "Góc ảnh bạn đọc", path: "goc-anh-ban-doc" },
            { label: "Cuộc sống nhân ái", path: "cuoc-song-nhan-ai" },
            { label: "Thư bạn đọc", path: "thu-ban-doc" }
        ],
        sidebarWidgets: [
            { title: "Nhà ở xã hội", rssSlug: "nha-o-xa-hoi", linkSlug: "nha-o-xa-hoi" },
            { title: "Tôi lên tiếng", rssSlug: "toi-len-tieng", linkSlug: "toi-len-tieng" },
            { title: "Góc ảnh bạn đọc", rssSlug: "goc-anh-ban-doc", linkSlug: "goc-anh-ban-doc" },
            { title: "Cuộc sống nhân ái", rssSlug: "cuoc-song-nhan-ai", linkSlug: "cuoc-song-nhan-ai" },
            { title: "Thư bạn đọc", rssSlug: "thu-ban-doc", linkSlug: "thu-ban-doc" }
        ]
    }
};

export default MENU_CONFIG;