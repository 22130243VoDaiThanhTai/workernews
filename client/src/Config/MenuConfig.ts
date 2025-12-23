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
            { title: "Chuyện thường ngày", rssSlug: "chuyen-thuong-ngay", linkSlug: "chuyen-thuong-ngay" },
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
    },

    "net-zero": {
        title: "Net Zero",
        basePath: "/net-zero",
        rssSlug: "net-zero",
        subMenu: [
            { label: "Tin tức & Xu hướng", path: "tin-tuc-xu-huong" },
            { label: "Chuyển đổi xanh", path: "chuyen-doi-xanh" },
            { label: "Sống xanh", path: "song-xanh" },
            { label: "Cẩm nang", path: "cam-nang" },
        ],
        sidebarWidgets: [
            { title: "Tin tức & Xu hướng", rssSlug: "tin-tuc-xu-huong", linkSlug: "tin-tuc-xu-huong" },
            { title: "Chuyển đổi xanh", rssSlug: "chuyen-doi-xanh", linkSlug: "chuyen-doi-xanh" },
            { title: "Sống xanh", rssSlug: "song-xanh", linkSlug: "song-xanh" },
            { title: "Cẩm nang", rssSlug: "cam-nang", linkSlug: "cam-nang" },
        ]
    },

    "kinh-te": {
        title: "Kinh tế",
        basePath: "/kinh-te",
        rssSlug: "kinh-te",
        subMenu: [
            { label: "Kinh doanh", path: "kinh-doanh" },
            { label: "Tiêu dùng", path: "tieu-dung" },
            { label: "Ô tô - Xe - Điện máy", path: "oto-xe-dien-may" },
            { label: "Bất động sản", path: "bat-dong-san" },
            { label: "Tài chính - Chứng khoán", path: "tai-chinh-chung-khoan" },
            { label: "Diễn đàn kinh tế", path: "dien-dan-kinh-te" }
        ],
        sidebarWidgets: [
            { title: "Kinh doanh", rssSlug: "kinh-doanh", linkSlug: "kinh-doanh" },
            { title: "Tiêu dùng", rssSlug: "tieu-dung", linkSlug: "tieu-dung" },
            { title: "Ô tô - Xe - Điện máy", rssSlug: "dien-dan-kinh-te", linkSlug: "dien-dan-kinh-te" },
            { title: "Bất động sản", rssSlug: "bat-dong-san", linkSlug: "bat-dong-san" },
            { title: "Tài chính - Chứng khoán", rssSlug: "tai-chinh-chung-khoan", linkSlug: "tai-chinh-chung-khoan" },
            { title: "Diễn đàn kinh tế", rssSlug: "dien-dan-kinh-te", linkSlug: "dien-dan-kinh-te" }
        ]
    },

    "suc-khoe": {
        title: "Sức khỏe",
        basePath: "/suc-khoe",
        rssSlug: "suc-khoe",
        subMenu: [
            { label: "Chuyển động y học", path: "chuyen-dong-y-hoc" },
            { label: "Giới tính", path: "gioi-tinh" },
            { label: "Bác sĩ của bạn", path: "bac-si-cua-ban" },
            { label: "Khỏe & Đẹp", path: "khoe-va-dep" }
        ],
        sidebarWidgets: [
            { title: "Chuyển động y học", rssSlug: "chuyen-dong-y-hoc", linkSlug: "chuyen-dong-y-hoc" },
            { title: "Giới tính", rssSlug: "gioi-tinh", linkSlug: "gioi-tinh" },
            { title: "Bác sĩ của bạn", rssSlug: "bac-si-cua-ban", linkSlug: "bac-si-cua-ban" },
            { title: "Khỏe & Đẹp", rssSlug: "khoe-va-dep", linkSlug: "khoe-va-dep" }
        ]
    },

    "giao-duc": {
        title: "Giáo dục",
        basePath: "/giao-duc",
        rssSlug: "giao-duc",
        subMenu: [
            { label: "Du học", path: "du-hoc" },
            { label: "Tuyển sinh", path: "tuyen-sinh" },      
            { label: "Sau bục giảng", path: "sau-buc-giang" }
        ],
        sidebarWidgets: [
            { title: "Du học", rssSlug: "du-hoc", linkSlug: "du-hoc" },
            { title: "Tuyển sinh", rssSlug: "tuyen-sinh", linkSlug: "tuyen-sinh" },
            { title: "Sau bục giảng", rssSlug: "sau-buc-giang", linkSlug: "sau-buc-giang" }
        ]
    },

    "phap-luat": {
        title: "Pháp luật",
        basePath: "/phap-luat",
        rssSlug: "phap-luat",
        subMenu: [
            { label: "Luật sư của bạn", path: "luat-su-cua-ban" },
            { label: "Truy nã", path: "truy-na" },
            { label: "Chuyện pháp đình", path: "chuyen-phap-dinh" }
        ],
        sidebarWidgets: [
            { title: "Luật sư của bạn", rssSlug: "luat-su-cua-ban", linkSlug: "luat-su-cua-ban" },
            { title: "Truy nã", rssSlug: "truy-na", linkSlug: "truy-na" },
            { title: "Chuyện pháp đình", rssSlug: "chuyen-phap-dinh", linkSlug: "chuyen-phap-dinh" }
        ]
    },

    "van-hoa-van-nghe": {
        title: "Văn hóa - Văn nghệ",
        basePath: "/van-hoa-van-nghe",
        rssSlug: "van-hoa-van-nghe",
        subMenu: [
            { label: "Âm nhạc", path: "am-nhac" },
            { label: "Văn học", path: "van-hoc" },
            { label: "Sân khấu", path: "san-khau" },
            { label: "Nghe - Xem - Đọc gì?", path: "nghe-xem-doc-gi" },
            { label: "Giải Mai Vàng", path: "https://maivang.nld.com.vn/" }
        ],
        sidebarWidgets: [
            { title: "Âm nhạc", rssSlug: "am-nhac", linkSlug: "am-nhac" },
            { title: "Sân khấu", rssSlug: "san-khau", linkSlug: "san-khau" },
            { title: "Điện ảnh", rssSlug: "dien-anh", linkSlug: "dien-anh" },
            { title: "Nghe - Xem - Đọc gì", rssSlug: "nghe-xem-doc-gi", linkSlug: "nghe-xem-doc-gi" }

        ]
    },

    "giai-tri": {
        title: "Giải trí",
        basePath: "/giai-tri",
        rssSlug: "giai-tri",
        subMenu: [
            { label: "Hậu trường Showbiz", path: "hau-truong-showbiz" },
            { label: "Chuyện của sao", path: "chuyen-cua-sao" }
        ],
        sidebarWidgets: [
            { title: "Hậu trường Showbiz", rssSlug: "hau-truong-showbiz", linkSlug: "hau-truong-showbiz" },
            { title: "Chuyện của sao", rssSlug: "chuyen-cua-sao", linkSlug: "chuyen-cua-sao" }
        ]
    },

    "the-thao": {
        title: "Thể thao",
        basePath: "/the-thao",
        rssSlug: "the-thao",
        subMenu: [
            { label: "Bóng đá", path: "bong-da" },
            { label: "Golf", path: "golf" },
            { label: "Hậu trường", path: "hau-truong" },
            { label: "Tennis", path: "tennis" },
            { label: "Marathon", path: "marathon" },
            { label: "Các môn khác", path: "cac-mon-khac" }
        ],
        sidebarWidgets: [
            { title: "Bóng đá", rssSlug: "bong-da", linkSlug: "bong-da" },
            { title: "Golf", rssSlug: "golf", linkSlug: "golf" },
            { title: "Hậu trường", rssSlug: "hau-truong", linkSlug: "hau-truong" },
            { title: "Tennis", rssSlug: "tennis", linkSlug: "tennis" },
            { title: "Marathon", rssSlug: "marathon", linkSlug: "marathon" },
            { title: "Các môn khác", rssSlug: "cac-mon-khac", linkSlug: "cac-mon-khac" }
        ]
    },

    "ai-365": {
        title: "AI 365",
        basePath: "/ai-365",
        rssSlug: "ai-365",
        subMenu: [
            { label: "Công nghệ số", path: "cong-nghe-so" },
            { label: "Bảo mật", path: "bao-mat" },
            { label: "Mạng xã hội", path: "mang-xa-hoi" },
            { label: "Giải trí cùng AI", path: "giai-tri-cung-ai" }
        ],
        sidebarWidgets: [
            { title: "Công nghệ số", rssSlug: "cong-nghe-so", linkSlug: "cong-nghe-so" },
            { title: "Bảo mật", rssSlug: "bao-mat", linkSlug: "bao-mat" },
            { title: "Mạng xã hội", rssSlug: "mang-xa-hoi", linkSlug: "mang-xa-hoi" },
            { title: "Giải trí cùng AI", rssSlug: "giai-tri-cung-ai", linkSlug: "giai-tri-cung-ai" }
        ]
    },
    "phu-nu": {
        title: "Phụ nữ",
        basePath: "https://phunu.nld.com.vn",
        rssSlug: "phu-nu",
         subMenu: [           
        ],
        sidebarWidgets: [           
        ]   
    },
    
    "gia-dinh": {
        title: "Gia đình",
        basePath: "/gia-dinh",
        rssSlug: "gia-dinh",
        subMenu: [
            { label: "Không gian sống", path: "khong-gian-song" },
            { label: "Cha mẹ và con cái", path: "cha-me-va-con-cai" },
            { label: "Bí quyết làm đẹp", path: "bi-quyet-lam-dep" }
        ],
        sidebarWidgets: [
            { title: "Không gian sống", rssSlug: "khong-gian-song", linkSlug: "khong-gian-song" },
            { title: "Cha mẹ và con cái", rssSlug: "cha-me-va-con-cai", linkSlug: "cha-me-va-con-cai" },
            { title: "Bí quyết làm đẹp", rssSlug: "bi-quyet-lam-dep", linkSlug: "bi-quyet-lam-dep" }
        ]
    },
    "dia-oc": {
        title: "Địa ốc",
        basePath: "https://diaoc.nld.com.vn", // Link gốc
        rssSlug: "dia-oc",
         subMenu: [           
        ],
        sidebarWidgets: [           
        ]   
    }

};

export default MENU_CONFIG;