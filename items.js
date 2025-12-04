// ============================================
// HỆ THỐNG VẬT PHẨM - HÀNH TRÌNH TƯ TƯỞNG
// ============================================

const ITEMS = {
    aoBalos: {
        id: 'aoBalos',
        name: 'Áo Ba Lỗ',
        icon: '🎽',
        description: 'Mát mẻ, thoải mái!  Cộng thêm 5 điểm vào tổng kết.',
        slot: 'top',
        rarity: 'common',
        dropWeight: 25,
        effect: {
            type: 'BONUS_SCORE',
            value: 5
        },
        equipped: false
    },
    nonLa: {
        id: 'nonLa',
        name: 'Nón Lá',
        icon: '👒',
        description: 'Biểu tượng Việt Nam!  Tăng 10% tổng điểm cuối cùng.',
        slot: 'hat',
        rarity: 'rare',
        dropWeight: 15,
        effect: {
            type: 'MULTIPLY_TOTAL',
            value: 1.1
        },
        equipped: false
    },
    quanDui: {
        id: 'quanDui',
        name: 'Quần Đùi',
        icon: '🩳',
        description: 'Năng động, trẻ trung! Cộng thêm 10 điểm vào tổng kết.',
        slot: 'bottom',
        rarity: 'common',
        dropWeight: 25,
        effect: {
            type: 'BONUS_SCORE',
            value: 10
        },
        equipped: false
    },
    depLao: {
        id: 'depLao',
        name: 'Dép Lào',
        icon: '🩴',
        description: 'Đơn giản mà hiệu quả!  Cộng thêm 10 điểm vào tổng kết.',
        slot: 'shoes',
        rarity: 'common',
        dropWeight: 25,
        effect: {
            type: 'BONUS_SCORE',
            value: 10
        },
        equipped: false
    },
    depToOng: {
        id: 'depToOng',
        name: 'Dép Tổ Ong',
        icon: '👟',
        description: 'Huyền thoại một thời! Tăng 50% tỉ lệ rớt đồ xịn.',
        slot: 'shoes',
        rarity: 'epic',
        dropWeight: 10,
        effect: {
            type: 'INCREASE_DROP_RATE',
            value: 0.5
        },
        equipped: false
    },
    aoDai: {
        id: 'aoDai',
        name: 'Áo Dài',
        icon: '👘',
        description: 'Trang phục truyền thống! 33% cơ hội được chọn lại khi trả lời sai.',
        slot: 'top',
        rarity: 'legendary',
        dropWeight: 8,
        effect: {
            type: 'SECOND_CHANCE',
            value: 33
        },
        equipped: false
    },
    xeDapThongNhat: {
        id: 'xeDapThongNhat',
        name: 'Xe Đạp Thống Nhất',
        icon: '🚲',
        description: 'Xế cổ huyền thoại!  Điểm mỗi câu Vòng 1 tăng lên 20 (tính lại từ đầu).',
        slot: 'vehicle',
        rarity: 'legendary',
        dropWeight: 5,
        effect: {
            type: 'DOUBLE_ROUND1_SCORE',
            value: 20
        },
        equipped: false
    },
    aoTuThan: {
        id: 'aoTuThan',
        name: 'Áo Tứ Thân',
        icon: '👗',
        description: '⚠️ RỦI RO CAO!  50% nhân đôi điểm HOẶC 50% mất nửa điểm ở cuối game.',
        slot: 'top',
        rarity: 'legendary',
        dropWeight: 7,
        effect: {
            type: 'GAMBLE',
            value: 0.5
        },
        equipped: false
    }
};

// Danh sách items theo thứ tự ưu tiên rớt
const ITEM_DROP_ORDER = [
    'depToOng',      // Epic - tăng drop rate nên ưu tiên rớt sớm
    'xeDapThongNhat', // Legendary
    'aoDai',          // Legendary
    'aoTuThan',       // Legendary
    'nonLa',          // Rare
    'aoBalos',        // Common
    'quanDui',        // Common
    'depLao'          // Common
];

// Hàm tính toán drop item
function calculateItemDrop(currentItems, dropRateBonus = 0, guaranteedDrops = 3, questionsAnswered = 0, totalQuestions = 15) {
    // Lọc ra các items chưa được nhặt
    const availableItems = ITEM_DROP_ORDER.filter(itemId => !currentItems.includes(itemId));
    
    if (availableItems.length === 0) return null;
    
    // Tính số items còn cần phải rớt để đảm bảo tối thiểu
    const itemsNeeded = guaranteedDrops - currentItems.length;
    const questionsRemaining = totalQuestions - questionsAnswered;
    
    // Base drop rate
    let baseDropRate = 0.25; // 25% cơ bản
    
    // Nếu cần đảm bảo rớt đủ items
    if (itemsNeeded > 0 && questionsRemaining <= itemsNeeded) {
        baseDropRate = 1.0; // 100% nếu cần thiết
    }
    
    // Áp dụng bonus từ Dép Tổ Ong
    const finalDropRate = Math.min(baseDropRate + dropRateBonus, 0.95);
    
    // Random xem có rớt không
    if (Math.random() > finalDropRate) return null;
    
    // Chọn item dựa trên weight
    let totalWeight = 0;
    const weightedItems = availableItems.map(itemId => {
        const item = ITEMS[itemId];
        // Tăng weight nếu có dép tổ ong (cho items rare/legendary)
        let weight = item.dropWeight;
        if (dropRateBonus > 0 && (item.rarity === 'rare' || item.rarity === 'legendary' || item.rarity === 'epic')) {
            weight *= 1.5;
        }
        totalWeight += weight;
        return { itemId, weight, cumulative: totalWeight };
    });
    
    const roll = Math.random() * totalWeight;
    for (const item of weightedItems) {
        if (roll <= item.cumulative) {
            return item.itemId;
        }
    }
    
    return availableItems[0]; // Fallback
}

// Export cho module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ITEMS, ITEM_DROP_ORDER, calculateItemDrop };
}