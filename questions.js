// ============================================
// NGÂN HÀNG CÂU HỎI - HÀNH TRÌNH TƯ TƯỞNG
// ============================================

const QUESTIONS = {
    // ============================================
    // VÒNG 1: HÀNH TRANG TRI THỨC (15 câu)
    // Điểm cố định: 10 điểm/câu
    // ============================================
    round1: [
        {
            id: 1,
            question: "Đại hội XI của Đảng (2011) xác định tư tưởng Hồ Chí Minh là kết quả của sự vận dụng và phát triển sáng tạo học thuyết nào?",
            answers: {
                A: "Nho giáo",
                B: "Chủ nghĩa Tam dân",
                C: "Chủ nghĩa Mác - Lênin",
                D: "Tư tưởng phương Tây"
            },
            correct: "C"
        },
        {
            id: 2,
            question: "Theo Hồ Chí Minh, ưu điểm lớn nhất của học thuyết Khổng Tử là gì?",
            answers: {
                A: "Sự tu dưỡng đạo đức cá nhân",
                B: "Lòng nhân ái cao cả",
                C: "Phương pháp làm việc biện chứng",
                D: "Tinh thần đấu tranh giai cấp"
            },
            correct: "A"
        },
        {
            id: 3,
            question: "Hồ Chí Minh xác định \"ham muốn tột bậc\" của Người là gì?",
            answers: {
                A: "Làm cho nước nhà được thống nhất",
                B: "Nước ta hoàn toàn độc lập, dân ta hoàn toàn tự do, ai cũng có cơm ăn áo mặc, ai cũng được học hành",
                C: "Xây dựng thành công chủ nghĩa xã hội",
                D: "Đánh đuổi thực dân Pháp và đế quốc Mỹ"
            },
            correct: "B"
        },
        {
            id: 4,
            question: "Trong Cương lĩnh chính trị đầu tiên (1930), lực lượng nòng cốt của cách mạng được xác định là giai cấp nào?",
            answers: {
                A: "Công nhân và trí thức",
                B: "Nông dân và tiểu tư sản",
                C: "Liên minh công - nông",
                D: "Tư sản dân tộc và địa chủ yêu nước"
            },
            correct: "C"
        },
        {
            id: 5,
            question: "Chọn cụm từ đúng điền vào chỗ trống: \"Không có gì quý hơn _______\".",
            answers: {
                A: "Giàu sang, phú quý",
                B: "Độc lập, tự do",
                C: "Hòa bình, thống nhất",
                D: "Tình yêu thương con người"
            },
            correct: "B"
        },
        {
            id: 6,
            question: "Theo Hồ Chí Minh, nền văn hóa mới phải có tính chất gì? ",
            answers: {
                A: "Dân tộc, khoa học, đại chúng",
                B: "Hiện đại, tiên tiến, văn minh",
                C: "Cổ truyền, bản sắc, độc đáo",
                D: "Quốc tế, hội nhập, phát triển"
            },
            correct: "A"
        },
        {
            id: 7,
            question: "Hồ Chí Minh cho rằng đạo đức là gì đối với người cách mạng?",
            answers: {
                A: "Là tài năng của người lãnh đạo",
                B: "Là gốc, là nền tảng",
                C: "Là phương tiện để thành công",
                D: "Là kết quả của quá trình rèn luyện"
            },
            correct: "B"
        },
        {
            id: 8,
            question: "Theo Hồ Chí Minh, phẩm chất đạo đức cơ bản của người cách mạng là gì?",
            answers: {
                A: "Cần, kiệm, liêm, chính, chí công vô tư",
                B: "Trung thành, dũng cảm, hy sinh",
                C: "Thông minh, sáng tạo, năng động",
                D: "Khiêm tốn, giản dị, hòa nhã"
            },
            correct: "A"
        },
        {
            id: 9,
            question: "Hồ Chí Minh nói: \"Một dân tộc, một đảng và mỗi con người, ngày hôm qua là vĩ đại... \" nhằm nhấn mạnh điều gì?",
            answers: {
                A: "Tầm quan trọng của lịch sử",
                B: "Sự cần thiết của việc học tập, rèn luyện liên tục",
                C: "Vai trò của Đảng trong cách mạng",
                D: "Tinh thần yêu nước của dân tộc"
            },
            correct: "B"
        },
        {
            id: 10,
            question: "Theo Hồ Chí Minh, Đảng Cộng sản Việt Nam là đảng của giai cấp nào?",
            answers: {
                A: "Chỉ của giai cấp công nhân",
                B: "Của giai cấp công nhân, đồng thời là đảng của nhân dân lao động và của dân tộc",
                C: "Của toàn thể nhân dân Việt Nam",
                D: "Của liên minh công - nông - trí thức"
            },
            correct: "B"
        },
        {
            id: 11,
            question: "Hồ Chí Minh xác định nguyên tắc tổ chức cơ bản của Đảng là gì?",
            answers: {
                A: "Tập trung dân chủ",
                B: "Phê bình và tự phê bình",
                C: "Đoàn kết thống nhất",
                D: "Kỷ luật nghiêm minh"
            },
            correct: "A"
        },
        {
            id: 12,
            question: "Theo Hồ Chí Minh, nhà nước ta mang bản chất giai cấp nào?",
            answers: {
                A: "Bản chất giai cấp tư sản",
                B: "Bản chất giai cấp công nhân",
                C: "Bản chất toàn dân",
                D: "Bản chất liên minh giai cấp"
            },
            correct: "B"
        },
        {
            id: 13,
            question: "Hồ Chí Minh khẳng định bản chất của nhà nước Việt Nam Dân chủ Cộng hòa là gì?",
            answers: {
                A: "Nhà nước của dân, do dân, vì dân",
                B: "Nhà nước chuyên chính vô sản",
                C: "Nhà nước dân chủ nhân dân",
                D: "Nhà nước pháp quyền xã hội chủ nghĩa"
            },
            correct: "A"
        },
        {
            id: 14,
            question: "Theo Hồ Chí Minh, tiêu chuẩn cơ bản nhất của con người mới xã hội chủ nghĩa là gì?",
            answers: {
                A: "Có trình độ học vấn cao",
                B: "Có đạo đức cách mạng",
                C: "Có tinh thần yêu nước",
                D: "Có ý thức kỷ luật tốt"
            },
            correct: "B"
        },
        {
            id: 15,
            question: "Hồ Chí Minh cho rằng để xây dựng chủ nghĩa xã hội, trước hết cần có điều gì?",
            answers: {
                A: "Có vốn đầu tư lớn",
                B: "Có con người xã hội chủ nghĩa",
                C: "Có khoa học kỹ thuật tiên tiến",
                D: "Có sự giúp đỡ của quốc tế"
            },
            correct: "B"
        }
    ],

    // ============================================
    // VÒNG 2: TIỀM THỨC (15 câu)
    // Điểm ngẫu nhiên: 5-20 điểm/câu
    // ============================================
    round2: [
        {
            id: 1,
            question: "Theo Hồ Chí Minh, đặc điểm to nhất của Việt Nam trong thời kỳ quá độ lên chủ nghĩa xã hội là gì?",
            answers: {
                A: "Bị chiến tranh tàn phá nặng nề",
                B: "Từ một nước nông nghiệp lạc hậu tiến thẳng lên chủ nghĩa xã hội không kinh qua giai đoạn phát triển tư bản chủ nghĩa",
                C: "Có sự giúp đỡ của các nước xã hội chủ nghĩa anh em",
                D: "Nền kinh tế còn nhiều thành phần phức tạp"
            },
            correct: "B"
        },
        {
            id: 2,
            question: "Hồ Chí Minh ví vai trò của đại đoàn kết đối với thành công như thế nào? ",
            answers: {
                A: "Như nền móng của một ngôi nhà",
                B: "Điểm mẹ.  Điểm này mà thực hiện tốt thì đẻ ra con cháu đều tốt",
                C: "Như kim chỉ nam cho mọi hành động",
                D: "Như ngọn hải đăng soi đường"
            },
            correct: "B"
        },
        {
            id: 3,
            question: "Trong xây dựng Đảng, Hồ Chí Minh coi vũ khí nào là \"thang thuốc\" tốt nhất để sửa chữa khuyết điểm?",
            answers: {
                A: "Kỷ luật nghiêm minh",
                B: "Tự phê bình và phê bình",
                C: "Học tập lý luận Mác - Lênin",
                D: "Liên hệ mật thiết với nhân dân"
            },
            correct: "B"
        },
        {
            id: 4,
            question: "Theo Hồ Chí Minh, \"giặc nội xâm\" bao gồm những tệ nạn nào?",
            answers: {
                A: "Tham ô, lãng phí, quan liêu",
                B: "Cờ bạc, rượu chè, mê tín",
                C: "Bè phái, cục bộ, địa phương",
                D: "Lười biếng, dối trá, kiêu ngạo"
            },
            correct: "A"
        },
        {
            id: 5,
            question: "Hồ Chí Minh nhấn mạnh mối quan hệ giữa đạo đức và tài năng như thế nào?",
            answers: {
                A: "Tài năng quan trọng hơn đạo đức",
                B: "Đức là gốc, tài là cành lá",
                C: "Tài và đức ngang bằng nhau",
                D: "Có tài ắt sẽ có đức"
            },
            correct: "B"
        },
        {
            id: 6,
            question: "Theo Hồ Chí Minh, nguồn gốc sức mạnh của Đảng là từ đâu?",
            answers: {
                A: "Từ đường lối đúng đắn",
                B: "Từ sự đoàn kết thống nhất trong Đảng",
                C: "Từ mối liên hệ mật thiết với nhân dân",
                D: "Tất cả các ý trên"
            },
            correct: "D"
        },
        {
            id: 7,
            question: "Hồ Chí Minh quan niệm thế nào về mối quan hệ giữa dân với Đảng? ",
            answers: {
                A: "Dân là gốc, Đảng là cành",
                B: "Đảng lãnh đạo, dân làm chủ",
                C: "Đảng với dân như cá với nước",
                D: "Đảng là cha mẹ, dân là con"
            },
            correct: "C"
        },
        {
            id: 8,
            question: "Theo Hồ Chí Minh, mục đích cuối cùng của chủ nghĩa xã hội là gì?",
            answers: {
                A: "Xóa bỏ giai cấp bóc lột",
                B: "Không ngừng nâng cao đời sống vật chất và tinh thần của nhân dân",
                C: "Phát triển kinh tế vượt bậc",
                D: "Xây dựng xã hội công bằng"
            },
            correct: "B"
        },
        {
            id: 9,
            question: "Hồ Chí Minh cho rằng cách mạng là sự nghiệp của ai?",
            answers: {
                A: "Của Đảng Cộng sản",
                B: "Của giai cấp công nhân",
                C: "Của quần chúng nhân dân",
                D: "Của các nhà lãnh đạo"
            },
            correct: "C"
        },
        {
            id: 10,
            question: "Theo Hồ Chí Minh, yếu tố nào quyết định sự tồn vong của Đảng? ",
            answers: {
                A: "Số lượng đảng viên đông đảo",
                B: "Sự trong sạch, vững mạnh về tư tưởng và tổ chức",
                C: "Có nguồn tài chính dồi dào",
                D: "Được quốc tế công nhận và ủng hộ"
            },
            correct: "B"
        },
        {
            id: 11,
            question: "Hồ Chí Minh nói: \"Muốn xây dựng chủ nghĩa xã hội, trước hết cần có... \" gì?",
            answers: {
                A: "Những người lao động tiên tiến",
                B: "Những nhà khoa học giỏi",
                C: "Những con người xã hội chủ nghĩa",
                D: "Những cán bộ có năng lực"
            },
            correct: "C"
        },
        {
            id: 12,
            question: "Theo Hồ Chí Minh, văn hóa có vai trò gì trong kháng chiến? ",
            answers: {
                A: "Văn hóa soi đường cho quốc dân đi",
                B: "Văn hóa là vũ khí tinh thần",
                C: "Văn hóa tạo động lực chiến đấu",
                D: "Tất cả các ý trên"
            },
            correct: "D"
        },
        {
            id: 13,
            question: "Hồ Chí Minh cho rằng điều kiện tiên quyết để xây dựng khối đại đoàn kết là gì?",
            answers: {
                A: "Có kẻ thù chung",
                B: "Có mục tiêu chung",
                C: "Có lợi ích chung và tôn trọng lợi ích riêng chính đáng",
                D: "Có sự lãnh đạo thống nhất"
            },
            correct: "C"
        },
        {
            id: 14,
            question: "Theo Hồ Chí Minh, phương châm \"dĩ bất biến, ứng vạn biến\" thể hiện điều gì?",
            answers: {
                A: "Sự linh hoạt trong chiến lược",
                B: "Giữ vững nguyên tắc, mềm dẻo về sách lược",
                C: "Thay đổi mục tiêu theo tình hình",
                D: "Kiên định lập trường giai cấp"
            },
            correct: "B"
        },
        {
            id: 15,
            question: "Theo Hồ Chí Minh, \"Nước lấy dân làm gốc\" có nghĩa là gì?",
            answers: {
                A: "Nhân dân là người làm nên lịch sử",
                B: "Mọi quyền lực nhà nước thuộc về nhân dân",
                C: "Nhân dân là nguồn gốc của mọi sức mạnh",
                D: "Tất cả các ý trên"
            },
            correct: "D"
        }
    ]
};

// ============================================
// HÀM TIỆN ÍCH CHO CÂU HỎI
// ============================================

/**
 * Xáo trộn mảng câu hỏi
 * @param {Array} array - Mảng cần xáo trộn
 * @returns {Array} - Mảng đã xáo trộn
 */
function shuffleQuestions(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math. floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Lấy câu hỏi theo vòng
 * @param {number} round - Số vòng (1 hoặc 2)
 * @param {boolean} shuffle - Có xáo trộn không
 * @returns {Array} - Danh sách câu hỏi
 */
function getQuestionsByRound(round, shuffle = true) {
    const questions = round === 1 ?  QUESTIONS. round1 : QUESTIONS.round2;
    return shuffle ? shuffleQuestions(questions) : [... questions];
}

/**
 * Tính điểm ngẫu nhiên cho Vòng 2
 * @returns {number} - Điểm từ 5-20
 */
function getRandomPoints() {
    return Math.floor(Math.random() * 16) + 5; // 5 đến 20
}

/**
 * Lấy tổng số câu hỏi mỗi vòng
 * @param {number} round - Số vòng
 * @returns {number} - Số câu hỏi
 */
function getTotalQuestions(round) {
    return round === 1 ? QUESTIONS.round1.length : QUESTIONS.round2. length;
}