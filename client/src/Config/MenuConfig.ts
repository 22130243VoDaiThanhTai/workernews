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
    }
};

export default MENU_CONFIG;