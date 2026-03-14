// 模拟餐厅数据
const userAvatarImg = '/images/01.png';

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  campus: string;
  price: number;
  distance: number;
  rating: number;
  image: string;
  tags: string[];
  location: {
    lat: number;
    lng: number;
    description?: string; // 例如：北门门口50m
  };
  popularDishes: string[];
  studentDiscount?: string;
  votes: {
    crowded: number;
    delicious: number;
    fast: number;
    slow: number;
  };
  verifyVotes?: {
    hasIt: number; // ✊确实有
    tasty: number; // 🤤好吃  
    closed: number; // 🏃没出摊/跑路了
  };
  openHours: string;
  phone: string;
  description?: string;
  dishes?: Dish[];
  reviews?: Review[];
  coupons?: Coupon[];
  specialTags?: string[]; // 减脂餐、清真、素食、低敏
  regionalAuth?: string; // 地域认证：湖南人认证的辣
  nightDelivery?: {
    range: string;
    budget: string;
  };
  isStreetVendor?: boolean; // 是否是小摊贩
  vendorType?: 'mobile' | 'fixed'; // mobile=游走摊贩, fixed=固定摊贩
  mobileRoute?: { lat: number; lng: number }[]; // 游走路线
  nutritionInfo?: {
    calories?: number;
    ingredients?: string[];
  };
  hasAllergenFree?: boolean; // 是否提供无过敏原菜品
  allergens?: string[]; // 常见过敏原
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  isPopular?: boolean;
  calories?: number;
  ingredients?: string[];
  allergens?: string[]; // 菜品包含的过敏原
}

export interface ReviewReply {
  id: string | number;
  name: string;
  school: string;
  avatar: string;
  content: string;
  time: string;
}

export interface Review {
  id: string;
  userName: string;
  userType: 'student' | 'staff'; // 学生或教职工
  userSchool: string; // 所属学校
  avatar: string;
  rating: number;
  content: string;
  images?: string[];
  tags?: string[];
  recommendedDishes?: string[];
  date: string;
  likes?: number;
  replies?: ReviewReply[];
}

export interface Coupon {
  id: string;
  title: string;
  description: string;
  validUntil: string;
  campus: string;
}

// 模拟当前登录用户数据
export const currentUser = {
  name: '猪猪小宝',
  avatar: userAvatarImg,
  campus: '北京服装学院',
  joinDate: '2020年9月',
  bio: '常驻北京设计专业研究生 专注于AI产品 什么都爱吃',
  stats: {
    favorites: 23,
    visited: 45,
    reviews: 18,
    points: 1280,
    coupons: 5
  }
};

export const campuses = [
  { id: 'bift', name: '北京服装学院', location: { lat: 39.9875, lng: 116.3289 } },
  { id: 'uibe', name: '对外经济贸易大学', location: { lat: 39.9842, lng: 116.4831 } },
  { id: 'bucm', name: '北京中医药大学', location: { lat: 39.9527, lng: 116.4336 } },
  { id: 'buct', name: '北京化工大学', location: { lat: 39.9445, lng: 116.3075 } },
  { id: 'cwu', name: '中华女子学院', location: { lat: 39.9563, lng: 116.3584 } }
];

export const categories = [
  '全部', '中餐', '西餐', '日韩料理', '快餐', '小吃', '甜品', '饮品', '火锅', '烧烤'
];

export interface GroupOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  campus: string;
  initiator: {
    name: string;
    avatar: string;
  };
  time: string; // 预计拼单时间/就餐时间
  totalSlots: number;
  joinedUsers: { name: string; avatar: string }[];
  status: 'recruiting' | 'full' | 'completed';
}

export let mockGroupOrders: GroupOrder[] = [
  {
    id: 'g1',
    restaurantId: '6',
    restaurantName: '海底捞火锅',
    restaurantImage: 'https://images.unsplash.com/photo-1658853576987-23d2ca596e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwaG90cG90JTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzM0NzE5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    campus: 'bift',
    initiator: { name: '火锅达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g1' },
    time: '今天 18:30',
    totalSlots: 4,
    joinedUsers: [
      { name: '火锅达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g1' },
      { name: '小张', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g2' }
    ],
    status: 'recruiting'
  },
  {
    id: 'g2',
    restaurantId: '29',
    restaurantName: '东北烧烤',
    restaurantImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    campus: 'bift',
    initiator: { name: '夜宵小王子', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g3' },
    time: '今晚 22:00',
    totalSlots: 6,
    joinedUsers: [
      { name: '夜宵小王子', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g3' },
      { name: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g4' },
      { name: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g5' },
      { name: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g6' },
      { name: '孙七', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g7' }
    ],
    status: 'recruiting'
  },
  {
    id: 'g3',
    restaurantId: '13',
    restaurantName: '湘菜馆',
    restaurantImage: 'https://images.unsplash.com/photo-1707967933821-809de732e50f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljeSUyMGNoaW5lc2UlMjBmb29kfGVufDF8fHx8MTc3MzQ3MTQxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    campus: 'uibe',
    initiator: { name: '辣妹子', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g13' },
    time: '明天 12:00',
    totalSlots: 4,
    joinedUsers: [
      { name: '辣妹子', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g13' }
    ],
    status: 'recruiting'
  },
  {
    id: 'g4',
    restaurantId: '10',
    restaurantName: '日式拉面馆',
    restaurantImage: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400',
    campus: 'bucm',
    initiator: { name: '面条杀手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g10' },
    time: '今晚 19:00',
    totalSlots: 2,
    joinedUsers: [
      { name: '面条杀手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=g10' }
    ],
    status: 'recruiting'
  }
];

export const mockRestaurants: Restaurant[] = [
  // === 新店 (默认添加到新店榜) ===
  {
    id: 'new-store-1',
    name: '淄博烧烤',
    category: '烧烤',
    campus: 'bift',
    price: 35,
    distance: 120,
    rating: 0,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    tags: ['新晋网红', '夜宵'],
    location: { lat: 39.9880, lng: 116.3290, description: '东门新开小吃街' },
    popularDishes: ['带皮五花', '烤饼', '小葱'],
    votes: { crowded: 0, delicious: 0, fast: 0, slow: 0 },
    verifyVotes: { hasIt: 5, tasty: 2, closed: 0 },
    openHours: '17:00-02:00',
    phone: '未知',
    description: '听说东门新开了一家淄博烧烤，有人去过吗？'
  },
  {
    id: 'new-store-2',
    name: '阿嬷手作奶茶',
    category: '饮品',
    campus: 'bift',
    price: 18,
    distance: 50,
    rating: 0,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
    tags: ['手作奶茶', '排队王'],
    location: { lat: 39.9875, lng: 116.3288, description: '食堂一楼南侧' },
    popularDishes: ['打·米麻薯', '老红糖珍珠奶茶'],
    votes: { crowded: 0, delicious: 0, fast: 0, slow: 0 },
    verifyVotes: { hasIt: 8, tasty: 3, closed: 1 },
    openHours: '10:00-22:00',
    phone: '未知',
    description: '食堂好像新进驻了阿嬷手作，排队人很多，求拔草。'
  },
  // === 中餐 ===
  {
    id: '1',
    name: '老北京炸酱面',
    category: '中餐',
    campus: 'bift',
    price: 25,
    distance: 200,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    tags: ['面食', '地道', '份量足'],
    location: { lat: 39.9880, lng: 116.3295, description: '北门门口50m' },
    popularDishes: ['老北京炸酱面', '小碗干炸', '炸酱拌面'],
    studentDiscount: '凭北京服装学院学生证享8.5折',
    votes: { crowded: 89, delicious: 256, fast: 178, slow: 23 },
    verifyVotes: { hasIt: 45, tasty: 112, closed: 2 },
    openHours: '10:00-21:00',
    phone: '010-12345678',
    description: '地道老北京风味，传承三代的手艺，份量十足，学生最爱。',
    regionalAuth: '北京人认证的老味道',
    dishes: [
      { id: 'd1-1', name: '老北京炸酱面', price: 22, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', isPopular: true, calories: 650, ingredients: ['面条', '猪肉', '黄酱', '黄瓜'] },
      { id: 'd1-2', name: '小碗干炸', price: 18, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', isPopular: true, calories: 580 },
      { id: 'd1-3', name: '炸酱拌面', price: 20, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', isPopular: true, calories: 620 },
      { id: 'd1-4', name: '京味炒肝', price: 15, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', calories: 420 },
    ],
    coupons: [
      { id: 'c1-1', title: '学生专享8.5折', description: '凭北京服装学院学生证享受', validUntil: '2026-06-30', campus: 'bift' }
    ],
    reviews: [
      {
        id: 'r1-1',
        userName: '设计系小王',
        userType: 'student',
        userSchool: '北京服装学院',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        rating: 5,
        content: '老北京炸酱面太正宗了！份量特别足，一碗能吃得很饱。酱料香浓，面条劲道，是我吃过最地道的炸酱面！',
        images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400'],
        tags: ['份量足', '地道', '好吃'],
        recommendedDishes: ['老北京炸酱面'],
        date: '2026-03-10',
        likes: 89
      },
      {
        id: 'r1-2',
        userName: '李教授',
        userType: 'staff',
        userSchool: '北京服装学院',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        rating: 5,
        content: '在学校附近吃了这么多年，还是这家最正宗。老板人也很好，学生优惠很实在。',
        images: ['https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400'],
        tags: ['实惠', '老字号'],
        recommendedDishes: ['炸酱拌面'],
        date: '2026-03-08',
        likes: 56
      },
      {
        id: 'r1-3',
        userName: '吃货小明',
        userType: 'student',
        userSchool: '对外经济贸易大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
        rating: 4,
        content: '周末特意跑过来吃的，味道确实不错！就是人太多了，排了一会儿队。',
        images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'],
        tags: ['人气旺', '味道好'],
        recommendedDishes: ['小碗干炸', '京味炒肝'],
        date: '2026-03-14',
        likes: 32
      }
    ]
  },
  {
    id: '13',
    name: '湘菜馆',
    category: '中餐',
    campus: 'uibe',
    price: 45,
    distance: 320,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1707967933821-809de732e50f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljeSUyMGNoaW5lc2UlMjBmb29kfGVufDF8fHx8MTc3MzQ3MTQxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['湘菜', '麻辣', '下饭'],
    location: { lat: 39.9838, lng: 116.4835, description: '图书馆后门' },
    popularDishes: ['剁椒鱼头', '小炒肉', '毛氏红烧肉'],
    studentDiscount: '学生9折',
    votes: { crowded: 145, delicious: 289, fast: 98, slow: 67 },
    verifyVotes: { hasIt: 38, tasty: 145, closed: 1 },
    openHours: '11:00-22:00',
    phone: '010-12345690',
    regionalAuth: '湖南人认证的辣',
    specialTags: ['辣度可调'],
    nightDelivery: { range: '校内全覆盖', budget: '¥35起送' },
    coupons: [
      { id: 'c13-1', title: '学生专享9折', description: '凭学生证全场9折', validUntil: '2026-12-31', campus: 'uibe' }
    ],
    reviews: [
      {
        id: 'r13-1',
        userName: '湖南老乡',
        userType: 'student',
        userSchool: '对外经济贸易大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=13',
        rating: 5,
        content: '作为湖南人，这家店的味道真的很正宗！剁椒鱼头做得特别好，辣度刚刚好，下饭神器！',
        images: ['https://images.unsplash.com/photo-1707967933821-809de732e50f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljeSUyMGNoaW5lc2UlMjBmb29kfGVufDF8fHx8MTc3MzQ3MTQxOXww&ixlib=rb-4.1.0&q=80&w=1080'],
        tags: ['正宗', '下饭', '辣'],
        recommendedDishes: ['剁椒鱼头', '小炒肉'],
        date: '2026-03-12',
        likes: 134
      },
      {
        id: 'r13-2',
        userName: '无辣不欢',
        userType: 'student',
        userSchool: '北京服装学院',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=13-2',
        rating: 5,
        content: '小炒肉绝绝子！每次来必点，肉片切得薄薄的，青椒也很入味。',
        images: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=400'],
        tags: ['必点', '香辣'],
        recommendedDishes: ['小炒肉'],
        date: '2026-03-13',
        likes: 89
      },
      {
        id: 'r13-3',
        userName: '干饭人',
        userType: 'student',
        userSchool: '对外经济贸易大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=13-3',
        rating: 4,
        content: '分量很大，米饭杀手，就是饭点人比较多需要排队，建议提前来。',
        images: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400'],
        tags: ['分量大', '排队多'],
        recommendedDishes: ['毛氏红烧肉'],
        date: '2026-03-14',
        likes: 45
      }
    ]
  },
  {
    id: '14',
    name: '广式煲汤',
    category: '中餐',
    campus: 'bucm',
    price: 35,
    distance: 280,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    tags: ['煲汤', '养生', '清淡'],
    location: { lat: 39.9530, lng: 116.4340, description: '南门右侧' },
    popularDishes: ['老火靓汤', '煲仔饭', '广式烧味'],
    studentDiscount: '学生送例汤',
    votes: { crowded: 78, delicious: 198, fast: 134, slow: 45 },
    verifyVotes: { hasIt: 29, tasty: 98, closed: 0 },
    openHours: '10:30-21:30',
    phone: '010-12345691',
    regionalAuth: '广东人认证的煲汤',
    specialTags: ['养生', '清淡'],
    nutritionInfo: { ingredients: ['鸡肉', '红枣', '枸杞', '党参'] },
    reviews: [
      {
        id: 'r14-1',
        userName: '中医系张同学',
        userType: 'student',
        userSchool: '北京中医药大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=14',
        rating: 5,
        content: '汤真的很好喝，很养生，特别适合我们中医药大学的学生。老板娘是广东人，汤都是用心熬的。',
        images: ['https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'],
        tags: ['养生', '好喝'],
        recommendedDishes: ['老火靓汤'],
        date: '2026-03-11',
        likes: 67
      }
    ]
  },
  {
    id: '15',
    name: '重庆小面',
    category: '中餐',
    campus: 'bucm',
    price: 18,
    distance: 180,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
    tags: ['面食', '麻辣', '快捷'],
    location: { lat: 39.9533, lng: 116.4342, description: '东门对面' },
    popularDishes: ['重庆小面', '红油抄���', '酸辣粉'],
    studentDiscount: '学生送小菜',
    votes: { crowded: 123, delicious: 267, fast: 189, slow: 45 },
    verifyVotes: { hasIt: 42, tasty: 134, closed: 1 },
    openHours: '10:00-21:00',
    phone: '010-12345685',
    regionalAuth: '重庆人认证的麻辣',
    specialTags: ['辣度可调'],
    reviews: [
      {
        id: 'r15-1',
        userName: '川渝学生',
        userType: 'student',
        userSchool: '北京中医药大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=15',
        rating: 5,
        content: '作为重庆人，这家小面做得很地道！麻辣味道正宗，价格也实惠。',
        images: ['https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400'],
        tags: ['正宗', '麻辣'],
        recommendedDishes: ['重庆小面'],
        date: '2026-03-09',
        likes: 78
      }
    ]
  },

  // === 西餐 ===
  {
    id: '5',
    name: '必胜客',
    category: '西餐',
    campus: 'uibe',
    price: 60,
    distance: 250,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    tags: ['披萨', '西餐', '聚会'],
    location: { lat: 39.9848, lng: 116.4838, description: '西门商业街' },
    popularDishes: ['超级至尊披萨', '意面', '烤翅'],
    studentDiscount: '学生套餐优惠',
    votes: { crowded: 145, delicious: 223, fast: 78, slow: 98 },
    verifyVotes: { hasIt: 56, tasty: 89, closed: 0 },
    openHours: '10:00-22:00',
    phone: '010-12345682',
  },
  {
    id: '16',
    name: '意大利餐厅',
    category: '西餐',
    campus: 'bift',
    price: 85,
    distance: 450,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    tags: ['意式', '浪漫', '约会'],
    location: { lat: 39.9865, lng: 116.3282, description: '学院路商圈' },
    popularDishes: ['意大利面', '提拉米苏', '牛排'],
    votes: { crowded: 67, delicious: 178, fast: 45, slow: 89 },
    verifyVotes: { hasIt: 28, tasty: 67, closed: 0 },
    openHours: '11:00-23:00',
    phone: '010-12345692',
    reviews: [
      {
        id: 'r16-1',
        userName: '浪漫小姐姐',
        userType: 'student',
        userSchool: '北京服装学院',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=16',
        rating: 5,
        content: '环境很好，适合约会。提拉米苏超级好吃！',
        images: ['https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'],
        tags: ['环境好', '好吃'],
        recommendedDishes: ['提拉米苏'],
        date: '2026-03-13',
        likes: 45
      }
    ]
  },
  {
    id: '17',
    name: '西式简餐',
    category: '西餐',
    campus: 'buct',
    price: 48,
    distance: 220,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    tags: ['沙拉', '健康', '轻食'],
    location: { lat: 39.9450, lng: 116.3080, description: '食堂旁边' },
    popularDishes: ['凯撒沙拉', '三明治', '牛排'],
    specialTags: ['减脂餐', '低卡'],
    votes: { crowded: 56, delicious: 134, fast: 98, slow: 34 },
    verifyVotes: { hasIt: 23, tasty: 56, closed: 0 },
    openHours: '09:00-21:00',
    phone: '010-12345693',
    nutritionInfo: { calories: 450, ingredients: ['生菜', '鸡胸肉', '全麦面包'] },
    reviews: [
      {
        id: 'r17-1',
        userName: '健身达人',
        userType: 'student',
        userSchool: '北京化工大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=17',
        rating: 5,
        content: '减脂期的救星！沙拉新鲜，热量标注清楚，吃得放心。',
        images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'],
        tags: ['健康', '减脂'],
        recommendedDishes: ['凯撒沙拉'],
        date: '2026-03-10',
        likes: 89
      }
    ]
  },

  // === 日韩料理 ===
  {
    id: '4',
    name: '韩式炸鸡',
    category: '日韩料理',
    campus: 'bift',
    price: 45,
    distance: 400,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
    tags: ['炸鸡', '韩式', '聚餐'],
    location: { lat: 39.9868, lng: 116.3285, description: '西门口' },
    popularDishes: ['蜂蜜炸鸡', '芝士炸鸡', '辣炒年糕'],
    votes: { crowded: 198, delicious: 312, fast: 67, slow: 123 },
    verifyVotes: { hasIt: 67, tasty: 156, closed: 2 },
    openHours: '11:00-23:00',
    phone: '010-12345681',
    nightDelivery: { range: '3km', budget: '¥40起送' },
  },
  {
    id: '10',
    name: '日式拉面馆',
    category: '日韩料理',
    campus: 'bucm',
    price: 38,
    distance: 350,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400',
    tags: ['拉面', '日式', '正宗'],
    location: { lat: 39.9515, lng: 116.4348, description: '北门右转100m' },
    popularDishes: ['豚骨拉面', '叉烧拉面', '味噌拉面'],
    studentDiscount: '凭中医药大学学生证免费领取一碗汤',
    votes: { crowded: 145, delicious: 287, fast: 156, slow: 78 },
    verifyVotes: { hasIt: 58, tasty: 145, closed: 0 },
    openHours: '11:00-22:00',
    phone: '010-12345687',
    description: '地道日式拉面，汤底浓郁，学生最爱的深夜食堂。',
    nightDelivery: { range: '校内', budget: '¥30起送' },
    dishes: [
      { id: 'd10-1', name: '豚骨拉面', price: 38, image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400', isPopular: true, calories: 680 },
      { id: 'd10-2', name: '叉烧拉面', price: 42, image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400', isPopular: true, calories: 720 },
      { id: 'd10-3', name: '味噌拉面', price: 36, image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400', isPopular: true, calories: 650 },
    ],
    coupons: [
      { id: 'c10-1', title: '学生免费汤品', description: '凭中医药大学学生证免费领取一碗汤', validUntil: '2026-12-31', campus: 'bucm' }
    ],
    reviews: [
      {
        id: 'r10-1',
        userName: '中医系学生',
        userType: 'student',
        userSchool: '北京中医药大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
        rating: 5,
        content: '豚骨拉面太好吃了！汤头很浓郁，面条很劲道。凭学生证还能免费领一碗汤，太划算了！',
        images: ['https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400'],
        tags: ['好吃', '实惠'],
        recommendedDishes: ['豚骨拉面'],
        date: '2026-03-12',
        likes: 123
      }
    ]
  },
  {
    id: '18',
    name: '寿司店',
    category: '日韩料理',
    campus: 'cwu',
    price: 55,
    distance: 180,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    tags: ['寿司', '日料', '新鲜'],
    location: { lat: 39.9568, lng: 116.3590, description: '正门对面' },
    popularDishes: ['三文鱼寿司', '金枪鱼刺身', '手握寿司'],
    votes: { crowded: 89, delicious: 167, fast: 112, slow: 45 },
    verifyVotes: { hasIt: 34, tasty: 78, closed: 0 },
    openHours: '11:00-21:30',
    phone: '010-12345694',
    reviews: [
      {
        id: 'r18-1',
        userName: '爱吃寿司的小仙女',
        userType: 'student',
        userSchool: '中华女子学院',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=18',
        rating: 5,
        content: '三文鱼很新鲜，寿司做得很精致。价格也合理，推荐！',
        images: ['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'],
        tags: ['新鲜', '精致'],
        recommendedDishes: ['三文鱼寿司'],
        date: '2026-03-11',
        likes: 56
      }
    ]
  },

  // === 快餐 ===
  {
    id: '11',
    name: '肯德基',
    category: '快餐',
    campus: 'bift',
    price: 35,
    distance: 280,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
    tags: ['快餐', '炸鸡', '连锁', '上菜快', '夜宵'],
    location: { lat: 39.9870, lng: 116.3300, description: '学校对面' },
    popularDishes: ['香辣鸡腿堡', '原味鸡', '葡式蛋挞', '薯条'],
    studentDiscount: '大神卡学生版享6折起',
    votes: { crowded: 256, delicious: 389, fast: 567, slow: 14 },
    verifyVotes: { hasIt: 189, tasty: 223, closed: 0 },
    openHours: '00:00-24:00',
    phone: '010-12345688',
    description: '24小时营业的深夜食堂，赶图/复习必备的快乐老家。',
    dishes: [
      { id: 'd11-1', name: '香辣鸡腿堡', price: 19.5, image: 'https://images.unsplash.com/photo-1671522635501-f03491b207e6?w=400', isPopular: true, calories: 550, ingredients: ['鸡腿肉', '生菜', '沙拉酱', '芝麻面包'] },
      { id: 'd11-2', name: '中薯条', price: 12, image: 'https://images.unsplash.com/photo-1591805364522-9d563414ee09?w=400', isPopular: true, calories: 350 },
      { id: 'd11-3', name: '葡式蛋挞', price: 8, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400', isPopular: true, calories: 200 }
    ],
    reviews: [
      {
        id: 'r11-1',
        userName: '赶图夜猫子',
        userType: 'student',
        userSchool: '北京服装学院',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kfc1',
        rating: 5,
        content: '每次熬夜做作业都会来这里点个夜宵，24小时营业太香了！香辣鸡腿堡永远的神，刚炸出来的薯条蘸番茄酱太治愈了。',
        images: ['https://images.unsplash.com/photo-1671522635501-f03491b207e6?w=400', 'https://images.unsplash.com/photo-1591805364522-9d563414ee09?w=400'],
        tags: ['深夜食堂', '出餐快', 'YYDS'],
        recommendedDishes: ['香辣鸡腿堡', '中薯条'],
        date: '2026-03-12',
        likes: 128,
        replies: [
          { id: 'rp11-1-1', name: '同熬夜的兄弟', school: '北京服装学院 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kfc-rep1', content: '昨晚两点在那看到你了兄弟，我也在画图😂', time: '昨天 02:30' },
          { id: 'rp11-1-2', name: '薯条控', school: '北京化工大学 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kfc-rep2', content: '必须让店员刚炸出来，放软了就不好吃了。', time: '昨天 09:15' }
        ]
      },
      {
        id: 'r11-2',
        userName: '周四必吃',
        userType: 'student',
        userSchool: '北京化工大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kfc2',
        rating: 4.5,
        content: '疯狂星期四V我50！蛋挞买一送一的时候必冲，不过饭点人真的太多了，建议用App提前点单再过去拿。',
        images: ['https://images.unsplash.com/photo-1673412810304-47c149ed0231?w=400', 'https://images.unsplash.com/photo-1764018292116-003fd7d1a0ba?w=400'],
        tags: ['疯狂星期四', '排队王', '蛋挞'],
        recommendedDishes: ['葡式蛋挞', '原味鸡'],
        date: '2026-03-05',
        likes: 256,
        replies: [
          { id: 'rp11-2-1', name: '今天周四', school: '对外经贸大学 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kfc-rep3', content: 'v我50看看实力，哈哈哈哈', time: '3天前' },
          { id: 'rp11-2-2', name: '打工人小李', school: '校园后勤 员工', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kfc-rep4', content: '用小程序点单可以省去排队时间，亲测有效。', time: '2天前' },
          { id: 'rp11-2-3', name: '原味鸡原教旨主义', school: '中华女子学院 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kfc-rep5', content: '原味鸡必须是三角！最爱三角部分！', time: '1天前' }
        ]
      }
    ]
  },
  {
    id: '19',
    name: '麦当劳',
    category: '快餐',
    campus: 'uibe',
    price: 32,
    distance: 200,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
    tags: ['快餐', '汉堡', '连锁'],
    location: { lat: 39.9845, lng: 116.4828, description: '东门左侧' },
    popularDishes: ['麦辣鸡腿堡', '麦乐鸡', '冰淇淋'],
    studentDiscount: '学生9折',
    votes: { crowded: 178, delicious: 156, fast: 289, slow: 23 },
    verifyVotes: { hasIt: 92, tasty: 98, closed: 0 },
    openHours: '06:30-23:30',
    phone: '010-12345695',
  },
  {
    id: '20',
    name: '汉堡王',
    category: '快餐',
    campus: 'buct',
    price: 38,
    distance: 310,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    tags: ['快餐', '汉堡', '火烤'],
    location: { lat: 39.9442, lng: 116.3068, description: '商业街' },
    popularDishes: ['皇堡', '鸡块', '洋葱圈'],
    votes: { crowded: 134, delicious: 167, fast: 234, slow: 45 },
    verifyVotes: { hasIt: 56, tasty: 89, closed: 0 },
    openHours: '08:00-23:00',
    phone: '010-12345696',
  },

  // === 小吃 ===
  {
    id: '3',
    name: '串香麻辣烫',
    category: '小吃',
    campus: 'bift',
    price: 20,
    distance: 300,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
    tags: ['麻辣烫', '实惠', '自选', '辣妹子最爱', '高性价比'],
    location: { lat: 39.9872, lng: 116.3298, description: '食堂后面' },
    popularDishes: ['红油骨汤麻辣烫', '金针菇', '肥牛卷', '自选蔬菜'],
    studentDiscount: '学生凭证满30减5',
    votes: { crowded: 467, delicious: 889, fast: 145, slow: 89 },
    verifyVotes: { hasIt: 378, tasty: 467, closed: 1 },
    openHours: '11:00-22:00',
    phone: '010-12345680',
    description: '浓郁骨汤熬制，加上灵魂辣椒油，菜品每日新鲜直采。',
    dishes: [
      { id: 'd3-1', name: '红油骨汤麻辣烫', price: 20, image: 'https://images.unsplash.com/photo-1723561796007-2fcf547ec47d?w=400', isPopular: true, calories: 400 },
      { id: 'd3-2', name: '自选菜品(按斤)', price: 18, image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400', isPopular: true, calories: 200 }
    ],
    reviews: [
      {
        id: 'r3-1',
        userName: '无辣不欢小张',
        userType: 'student',
        userSchool: '北京服装学院',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mlt1',
        rating: 5,
        content: '这家麻辣烫真的是我吃过最好吃的一家！红油锅底又麻又辣，而且骨汤特别浓郁，吃完菜连汤都能喝两口。菜品柜每天都收拾得很干净，强推他们家的肥牛和福袋。',
        images: ['https://images.unsplash.com/photo-1723561796007-2fcf547ec47d?w=400', 'https://images.unsplash.com/photo-1715755991417-12bd09e46f48?w=400'],
        tags: ['底汤浓郁', '菜品新鲜', '麻辣过瘾'],
        recommendedDishes: ['红油骨汤麻辣烫', '肥牛卷'],
        date: '2026-03-10',
        likes: 186,
        replies: [
          { id: 'rp3-1-1', name: '辣妹子', school: '中华女子学院 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mlt-rep1', content: '他家红油确实很香，每次必加双倍辣！', time: '12小时前' },
          { id: 'rp3-1-2', name: '不吃香菜', school: '北京服装学院 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mlt-rep2', content: '福袋里面满满的飞鱼籽，绝绝子', time: '3天前' }
        ]
      },
      {
        id: 'r3-2',
        userName: '减肥路上的绊脚石',
        userType: 'student',
        userSchool: '北京中医药大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mlt2',
        rating: 4.5,
        content: '性价比很高，每次随便夹一大盆才二十多块钱。可以选骨汤或者番茄汤，个人更推荐微辣的骨汤。唯一的缺点就是饭点人太多了，经常要和别人拼桌。',
        images: ['https://images.unsplash.com/photo-1652860213441-6622f9fec77f?w=400'],
        tags: ['性价比高', '排队王'],
        recommendedDishes: ['自选蔬菜'],
        date: '2026-03-02',
        likes: 95,
        replies: [
          { id: 'rp3-2-1', name: '减脂期也能吃', school: '北京中医药大学 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mlt-rep3', content: '骨汤去油煮蔬菜，真的很适合减脂期！', time: '5天前' }
        ]
      }
    ]
  },
  {
    id: '21',
    name: '煎饼果子摊',
    category: '小吃',
    campus: 'bift',
    price: 8,
    distance: 50,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400',
    tags: ['煎饼', '早餐', '便宜'],
    location: { lat: 39.9877, lng: 116.3291, description: '北门门口' },
    popularDishes: ['经典煎饼果子', '鸡蛋煎饼'],
    votes: { crowded: 234, delicious: 312, fast: 289, slow: 12 },
    verifyVotes: { hasIt: 89, tasty: 178, closed: 3 },
    openHours: '06:30-10:00',
    phone: '',
    isStreetVendor: true,
    vendorType: 'fixed',
    description: '天���大姐做的煎饼果子，每天早上北门必排队！',
    regionalAuth: '天津人认证的煎饼果子',
    reviews: [
      {
        id: 'r21-1',
        userName: '早起的鸟儿',
        userType: 'student',
        userSchool: '北京服装学院',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=21',
        rating: 5,
        content: '每天早上必吃！大姐手艺好，煎饼又脆又香，8块钱能吃饱！',
        images: ['https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400'],
        tags: ['好吃', '便宜', '必吃'],
        recommendedDishes: ['经典煎饼果子'],
        date: '2026-03-14',
        likes: 156
      }
    ]
  },
  {
    id: '22',
    name: '烤冷面摊',
    category: '小吃',
    campus: 'uibe',
    price: 10,
    distance: 80,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    tags: ['烤冷面', '夜宵', '东北'],
    location: { lat: 39.9840, lng: 116.4829, description: '西门附近游走' },
    popularDishes: ['烤冷面', '炸串'],
    votes: { crowded: 189, delicious: 267, fast: 234, slow: 23 },
    verifyVotes: { hasIt: 67, tasty: 134, closed: 5 },
    openHours: '18:00-23:00',
    phone: '',
    isStreetVendor: true,
    vendorType: 'mobile',
    mobileRoute: [
      { lat: 39.9840, lng: 116.4829 },
      { lat: 39.9842, lng: 116.4832 },
      { lat: 39.9838, lng: 116.4830 },
    ],
    nightDelivery: { range: '不配送', budget: '现场购买' },
    regionalAuth: '东北人认证的烤冷面',
  },
  {
    id: '23',
    name: '章鱼小丸子',
    category: '小吃',
    campus: 'cwu',
    price: 12,
    distance: 120,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
    tags: ['小丸子', '日式', '街边'],
    location: { lat: 39.9565, lng: 116.3588, description: '校门右侧' },
    popularDishes: ['经典章鱼小丸子', '芝士小丸子'],
    votes: { crowded: 123, delicious: 178, fast: 198, slow: 34 },
    verifyVotes: { hasIt: 45, tasty: 89, closed: 2 },
    openHours: '14:00-21:00',
    phone: '',
    isStreetVendor: true,
    vendorType: 'fixed',
  },

  // === 饮品 ===
  {
    id: '2',
    name: '星巴克咖啡',
    category: '饮品',
    campus: 'bift',
    price: 35,
    distance: 150,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400',
    tags: ['咖啡', '学习', '环境好'],
    location: { lat: 39.9878, lng: 116.3292, description: '图书馆一楼' },
    popularDishes: ['美式咖啡', '拿铁', '卡布奇诺'],
    studentDiscount: '凭北京服装学院学生证享9折',
    votes: { crowded: 134, delicious: 198, fast: 89, slow: 67 },
    verifyVotes: { hasIt: 67, tasty: 112, closed: 0 },
    openHours: '07:00-22:00',
    phone: '010-12345679',
    description: '舒适的学习环境，优质的咖啡，学生党的最爱聚集地。',
    dishes: [
      { id: 'd2-1', name: '美式咖啡', price: 28, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400', isPopular: true, calories: 10 },
      { id: 'd2-2', name: '拿铁', price: 32, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400', isPopular: true, calories: 180 },
      { id: 'd2-3', name: '卡布奇诺', price: 32, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400', isPopular: true, calories: 150 },
    ],
    coupons: [
      { id: 'c2-1', title: '学生专享9折', description: '凭北京服装学院学生证享受', validUntil: '2026-12-31', campus: 'bift' }
    ]
  },
  {
    id: '7',
    name: '蜜雪冰城',
    category: '饮品',
    campus: 'uibe',
    price: 8,
    distance: 100,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
    tags: ['奶��', '便宜', '网红'],
    location: { lat: 39.9845, lng: 116.4833, description: '南门口' },
    popularDishes: ['冰鲜柠檬水', '摇摇奶昔', '珍珠奶茶'],
    votes: { crowded: 89, delicious: 167, fast: 234, slow: 12 },
    verifyVotes: { hasIt: 78, tasty: 134, closed: 0 },
    openHours: '08:00-22:00',
    phone: '010-12345684',
  },
  {
    id: '9',
    name: '一点点奶茶',
    category: '饮品',
    campus: 'bucm',
    price: 15,
    distance: 220,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1756969953423-2c199c6dbd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBib2JhfGVufDF8fHx8MTc3MzQ2OTI2NHww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['奶茶', '鲜奶', '排队'],
    location: { lat: 39.9520, lng: 116.4330, description: '商业街中段' },
    popularDishes: ['四季奶青', '波霸奶茶', '红茶拿铁'],
    votes: { crowded: 178, delicious: 298, fast: 112, slow: 134 },
    verifyVotes: { hasIt: 89, tasty: 156, closed: 0 },
    openHours: '09:00-22:00',
    phone: '010-12345686',
  },
  {
    id: '24',
    name: '鲜榨果汁吧',
    category: '饮品',
    campus: 'buct',
    price: 18,
    distance: 160,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    tags: ['果汁', '健康', '鲜榨'],
    location: { lat: 39.9448, lng: 116.3078, description: '体育馆旁' },
    popularDishes: ['西瓜汁', '芒果汁', '混合果汁'],
    specialTags: ['低卡', '维生素'],
    votes: { crowded: 67, delicious: 145, fast: 167, slow: 23 },
    verifyVotes: { hasIt: 34, tasty: 67, closed: 0 },
    openHours: '09:00-21:00',
    phone: '010-12345697',
  },

  // === 甜品 ===
  {
    id: '12',
    name: '满记甜品',
    category: '甜品',
    campus: 'uibe',
    price: 28,
    distance: 320,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    tags: ['甜品', '港式', '下午茶'],
    location: { lat: 39.9838, lng: 116.4828, description: '美食街' },
    popularDishes: ['芒果班戟', '杨枝甘露', '双皮奶'],
    votes: { crowded: 98, delicious: 234, fast: 123, slow: 67 },
    verifyVotes: { hasIt: 56, tasty: 123, closed: 0 },
    openHours: '10:00-22:00',
    phone: '010-12345689',
  },
  {
    id: '25',
    name: '慕斯蛋糕店',
    category: '甜品',
    campus: 'bift',
    price: 32,
    distance: 280,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    tags: ['蛋糕', '甜品', '生日'],
    location: { lat: 39.9873, lng: 116.3296, description: '商业街' },
    popularDishes: ['草莓慕斯', '提拉米苏', '芝士蛋糕'],
    votes: { crowded: 78, delicious: 189, fast: 98, slow: 45 },
    verifyVotes: { hasIt: 45, tasty: 89, closed: 0 },
    openHours: '09:00-21:30',
    phone: '010-12345698',
  },
  {
    id: '26',
    name: '冰淇淋店',
    category: '甜品',
    campus: 'cwu',
    price: 22,
    distance: 190,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    tags: ['冰淇淋', '甜品', '网红'],
    location: { lat: 39.9566, lng: 116.3586, description: '中心广场' },
    popularDishes: ['巧克力冰淇淋', '草莓冰淇淋', '抹茶冰淇淋'],
    votes: { crowded: 123, delicious: 178, fast: 145, slow: 34 },
    verifyVotes: { hasIt: 56, tasty: 98, closed: 0 },
    openHours: '10:00-22:00',
    phone: '010-12345699',
  },

  // === 火锅 ===
  {
    id: '6',
    name: '海底捞火锅',
    category: '火锅',
    campus: 'uibe',
    price: 80,
    distance: 500,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1658853576987-23d2ca596e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwaG90cG90JTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzM0NzE5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['火锅', '服务好', '聚餐', '深夜食堂', '免费美甲'],
    location: { lat: 39.9835, lng: 116.4825, description: '商圈3楼' },
    popularDishes: ['番茄牛油双拼', '招牌虾滑', '捞派毛肚', '鸭血'],
    studentDiscount: '大学生全天享6.9折',
    votes: { crowded: 488, delicious: 765, fast: 124, slow: 334 },
    verifyVotes: { hasIt: 323, tasty: 589, closed: 0 },
    openHours: '10:00-07:00',
    phone: '010-12345683',
    description: '大学生必打卡的深夜食堂！服务满分，不仅好吃还能免费做美甲、擦鞋。',
    dishes: [
      { id: 'd6-1', name: '捞派招牌虾滑', price: 68, image: 'https://images.unsplash.com/photo-1611345157614-26d3bdd10c93?w=400', isPopular: true, calories: 250 },
      { id: 'd6-2', name: '雪花肥牛', price: 78, image: 'https://images.unsplash.com/photo-1733700469173-15d46efc2c09?w=400', isPopular: true, calories: 450 },
      { id: 'd6-3', name: '浓香番茄锅底', price: 38, image: 'https://images.unsplash.com/photo-1658853576987-23d2ca596e47?w=400', isPopular: true, calories: 150 }
    ],
    reviews: [
      {
        id: 'r6-1',
        userName: '干饭社社长',
        userType: 'student',
        userSchool: '对外经济贸易大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hdl1',
        rating: 5,
        content: '大学生69折真的太香了！周末晚上和室友们一起来吃，排队的时候还做了个美甲。番茄锅底配上牛肉粒加芹菜真的绝绝子，虾滑也是每次必点！服务员小哥还送了零食，体验拉满！',
        images: ['https://images.unsplash.com/photo-1611345157614-26d3bdd10c93?w=400', 'https://images.unsplash.com/photo-1733700469173-15d46efc2c09?w=400'],
        tags: ['服务好', '大学生优惠', '番茄锅'],
        recommendedDishes: ['捞派招牌虾滑', '浓香番茄锅底'],
        date: '2026-03-13',
        likes: 385,
        replies: [
          { id: 'rp6-1-1', name: '薅羊毛大队', school: '北京中医药大学 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hdl-rep1', content: '番茄锅配牛肉粒是神仙吃法，再点碗米饭自制番茄牛肉烩饭！', time: '12小时前' },
          { id: 'rp6-1-2', name: '美甲狂魔', school: '北京服装学院 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hdl-rep2', content: '他们家美甲现在要排好久，建议一到店就去拿号。', time: '1天前' }
        ]
      },
      {
        id: 'r6-2',
        userName: '肉食动物',
        userType: 'student',
        userSchool: '北京中医药大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hdl2',
        rating: 4.8,
        content: '除了排队时间有点长，其他没有任何毛病。肥牛品质很好，毛肚七上八下刚刚好，最重要的是服务态度真的让人如沐春风。',
        images: ['https://images.unsplash.com/photo-1658853577004-7a2e0fe5479a?w=400', 'https://images.unsplash.com/photo-1750677637369-7fae4d9e361b?w=400'],
        tags: ['排队王', '肉质新鲜'],
        recommendedDishes: ['雪花肥牛'],
        date: '2026-03-08',
        likes: 156,
        replies: [
          { id: 'rp6-2-1', name: '夜宵指北', school: '对外经济贸易大学 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hdl-rep3', content: '可以用App提前排号哦，或者半夜来吃就不排队了哈哈哈', time: '5天前' },
          { id: 'rp6-2-2', name: '服务体验官', school: '教职工', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hdl-rep4', content: '服务确实没得说，过生日还会给你举牌子唱歌😂', time: '4天前' }
        ]
      }
    ]
  },
  {
    id: '27',
    name: '小龙坎火锅',
    category: '火锅',
    campus: 'bucm',
    price: 75,
    distance: 420,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1666278172017-ad93e14c329d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWNodWFuJTIwc3BpY3klMjBob3Rwb3R8ZW58MXx8fHwxNzczNDcxOTE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['火锅', '川味', '麻辣'],
    location: { lat: 39.9525, lng: 116.4345, description: '购物中心2楼' },
    popularDishes: ['牛油锅底', '鲜毛肚', '手切羊肉'],
    regionalAuth: '四川人认证的火锅',
    votes: { crowded: 234, delicious: 378, fast: 45, slow: 189 },
    verifyVotes: { hasIt: 98, tasty: 234, closed: 0 },
    openHours: '11:00-23:30',
    phone: '010-12345700',
  },
  {
    id: '28',
    name: '呷哺呷哺',
    category: '火锅',
    campus: 'buct',
    price: 50,
    distance: 350,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
    tags: ['火锅', '小火锅', '快捷'],
    location: { lat: 39.9443, lng: 116.3072, description: '美食城' },
    popularDishes: ['麻辣锅底', '调料', '肥牛'],
    studentDiscount: '学生8.8折',
    votes: { crowded: 167, delicious: 234, fast: 123, slow: 89 },
    verifyVotes: { hasIt: 78, tasty: 145, closed: 0 },
    openHours: '10:30-22:00',
    phone: '010-12345701',
  },

  // === 烧烤 ===
  {
    id: '29',
    name: '东北烧烤',
    category: '烧烤',
    campus: 'bift',
    price: 55,
    distance: 380,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    tags: ['烧烤', '东北', '夜宵', '烟火气', '分量足'],
    location: { lat: 39.9866, lng: 116.3288, description: '夜市街' },
    popularDishes: ['锦州小串', '烤冷面', '烤羊肉串', '蒜蓉烤生蚝'],
    regionalAuth: '东北人认证的地道烧烤',
    nightDelivery: { range: '5km', budget: '¥50起送' },
    votes: { crowded: 398, delicious: 689, fast: 167, slow: 334 },
    verifyVotes: { hasIt: 289, tasty: 478, closed: 3 },
    openHours: '17:00-04:00',
    phone: '010-12345702',
    description: '老铁们的最爱，烤串师傅手艺一绝，配上冰镇啤酒绝了。',
    dishes: [
      { id: 'd29-1', name: '秘制烤羊肉串', price: 4, image: 'https://images.unsplash.com/photo-1763480005787-67c0fe4ee8f2?w=400', isPopular: true, calories: 120, ingredients: ['羊肉', '孜然', '辣椒面'] },
      { id: 'd29-2', name: '蒜蓉烤生蚝', price: 15, image: 'https://images.unsplash.com/photo-1593960548354-62d1b5c9d542?w=400', isPopular: true, calories: 90 },
      { id: 'd29-3', name: '烤冷面', price: 12, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', isPopular: true, calories: 350 }
    ],
    reviews: [
      {
        id: 'r29-1',
        userName: '哈尔滨小伙',
        userType: 'student',
        userSchool: '北京服装学院',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bbq1',
        rating: 5,
        content: '作为东北人，这家的烧烤味道真的很正宗！羊肉串肥瘦相间��烤得滋滋冒油，而且完全没有膻味。晚上跟室友来这撸串喝酒，简直是大学生活里最爽的事。',
        images: ['https://images.unsplash.com/photo-1763480005787-67c0fe4ee8f2?w=400', 'https://images.unsplash.com/photo-1593960548354-62d1b5c9d542?w=400'],
        tags: ['正宗', '量大管饱', '夜宵好去处'],
        recommendedDishes: ['秘制烤羊肉串', '蒜蓉烤生蚝'],
        date: '2026-03-12',
        likes: 245,
        replies: [
          { id: 'rp29-1-1', name: '同是东北人', school: '北京化工大学 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bbq-rep1', content: '老乡！这家的锦州小串也正宗，下次一定要尝尝', time: '前天 23:15' },
          { id: 'rp29-1-2', name: '夜市小霸王', school: '对外经济贸易大学 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bbq-rep2', content: '每次去晚了都没位子，老板生意太好了', time: '3天前' }
        ]
      },
      {
        id: 'r29-2',
        userName: '爱吃烤串的猫',
        userType: 'student',
        userSchool: '对外经济贸易大学',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bbq2',
        rating: 4.6,
        content: '烤冷面加辣条加烤肠是神仙吃法，酱汁酸甜口，老板人特别实在，经常给我们抹零。唯一缺点是周末晚上要排队等位置。',
        images: ['https://images.unsplash.com/photo-1688940738506-acfe9334bf5c?w=400', 'https://images.unsplash.com/photo-1723688743324-d971fc428621?w=400'],
        tags: ['烤冷面', '老板热情'],
        recommendedDishes: ['烤冷面'],
        date: '2026-03-09',
        likes: 112,
        replies: [
          { id: 'rp29-2-1', name: '碳水教父', school: '北京中医药大学 学生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bbq-rep3', content: '加辣条绝了，我也喜欢这种吃法！还要多加醋', time: '1周前' }
        ]
      }
    ]
  },
  {
    id: '30',
    name: '新疆烤肉',
    category: '烧烤',
    campus: 'uibe',
    price: 48,
    distance: 290,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    tags: ['烧烤', '新疆', '羊肉串'],
    location: { lat: 39.9843, lng: 116.4836, description: '美食街尽头' },
    popularDishes: ['羊肉串', '烤羊排', '馕'],
    specialTags: ['清真'],
    regionalAuth: '新疆人认证的烤肉',
    votes: { crowded: 167, delicious: 312, fast: 89, slow: 98 },
    verifyVotes: { hasIt: 67, tasty: 189, closed: 1 },
    openHours: '16:00-01:00',
    phone: '010-12345703',
  },
  {
    id: '31',
    name: '韩式烤肉',
    category: '烧烤',
    campus: 'bucm',
    price: 68,
    distance: 410,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400',
    tags: ['烧烤', '韩式', '聚会'],
    location: { lat: 39.9522, lng: 116.4342, description: '商业街3楼' },
    popularDishes: ['五花肉', '牛舌', '石锅拌饭'],
    votes: { crowded: 145, delicious: 256, fast: 78, slow: 112 },
    verifyVotes: { hasIt: 56, tasty: 134, closed: 0 },
    openHours: '11:00-23:00',
    phone: '010-12345704',
  },
];

// 今日推荐菜品
export const todayRecommendations = [
  {
    id: 'dish-1',
    name: '香辣鸡腿堡',
    restaurantId: '11',
    restaurant: '肯德基',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
    price: 18,
    orderCount: 342,
    dominatedList: '快餐热销榜',
    dominatedDays: 5,
    description: '最近有342人觉得这家店的这道菜很好吃'
  },
  {
    id: 'dish-2',
    name: '豚骨拉面',
    restaurantId: '10',
    restaurant: '日式拉面馆',
    image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400',
    price: 38,
    orderCount: 256,
    dominatedList: '面食好评榜',
    dominatedDays: 12,
    description: '最近有256人觉得这家店的这道菜很好吃'
  }
];

// 榜单数据
export const rankingLists = [
  {
    id: 'hot',
    title: '🔥 本周热门榜',
    description: '最受学生欢迎的餐厅',
    restaurants: ['1', '3', '6', '10', '4']
  },
  {
    id: 'new',
    title: '✨ 新店推荐',
    description: '新开业值得一试',
    restaurants: ['13', '16', '18', 'new-store-mock']
  },
  {
    id: 'cheap',
    title: '💰 性价比之王',
    description: '好吃不贵的选择',
    restaurants: ['7', '3', '21', '22']
  },
  {
    id: 'delicious',
    title: '😋 好评如潮',
    description: '高分餐厅推荐',
    restaurants: ['6', '1', '10', '13', '21']
  },
  {
    id: 'night',
    title: '🌙 夜宵专区',
    description: '深夜食堂，温暖你的胃',
    restaurants: ['29', '22', '30', '10']
  },
  {
    id: 'health',
    title: '🥗 健康饮食',
    description: '减脂餐、素食、低敏选择',
    restaurants: ['17', '14', '24']
  }
];

// 周边学校食堂攻略
export const canteenGuides = [
  {
    id: 'guide-1',
    school: '北京大学',
    canteens: [
      {
        name: '学一食堂',
        access: '需要校园卡，可在门口购买临时卡',
        recommendation: '二楼川菜窗口',
        avgPrice: 15,
        tips: '高峰期11:30-12:30人很多'
      },
      {
        name: '艺园食堂',
        access: '游客可进入，支付宝/微信支付',
        recommendation: '麻辣香锅、烤鱼',
        avgPrice: 20,
        tips: '环境好，适合聚餐'
      }
    ]
  },
  {
    id: 'guide-2',
    school: '清华大学',
    canteens: [
      {
        name: '桃李园',
        access: '需要学生带入或购买临时卡',
        recommendation: '万人食堂，选择超多',
        avgPrice: 12,
        tips: '推荐烤鸭饭和麻辣烫'
      }
    ]
  }
];

// --- 动态生成数据以满足各分类至少10家的需求 ---
const requiredCategories = ['饮品', '咖啡', '火锅', '地方菜', '小吃快餐', '面包蛋糕甜点', '烤肉', '自助餐', '西餐', '日料'];

const categoryImages: Record<string, string[]> = {
  '饮品': ['https://images.unsplash.com/photo-1546173159-315724a31696?w=400', 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400'],
  '咖啡': ['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'],
  '火锅': ['https://images.unsplash.com/photo-1658853576987-23d2ca596e47?w=400', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400'],
  '地方菜': ['https://images.unsplash.com/photo-1555126634-ae327bb28876?w=400', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400'],
  '小吃快餐': ['https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'],
  '面包蛋糕甜点': ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400'],
  '烤肉': ['https://images.unsplash.com/photo-1544025162-d76694265947?w=400', 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400'],
  '自助餐': ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'],
  '西餐': ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400'],
  '日料': ['https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400']
};

const commonAllergens = ['花生', '海鲜', '乳制品', '麸质', '大豆', '坚果'];

const realNames: Record<string, string[]> = {
  '饮品': ['半糖主义', '清茶浅饮', '果缤纷茶饮', '云端茶室', '夏日冰柠', '抹茶物语', '古早奶茶铺', '星空果饮', '遇见茶', '初心手作茶'],
  '咖啡': ['唤醒咖啡馆', '街角时光', '黑糖浓缩', '醇香时刻', '日晒豆屋', '拿铁公社', '猫语咖啡', '旧时光咖啡', '悠然手冲', '午后阳光'],
  '火锅': ['红火老灶', '蜀香阁', '热辣人生', '翻滚兄弟', '山城小聚', '大碗肚火锅', '沸腾岁月', '竹林牛百叶', '川妹子火锅', '捞得爽'],
  '地方菜': ['外婆小厨', '老北平饭馆', '湘情院', '巴蜀人家', '姑苏水乡菜', '西北食府', '客家小院', '粤味馆', '齐鲁人家', '京城小馆'],
  '小吃快餐': ['阿婆麻辣烫', '老街炸串', '王记肉夹馍', '手工水饺馆', '李家凉皮', '巷子口炒饭', '香脆煎饼', '快捷便当', '砂锅粉面', '牛杂小铺'],
  '面包蛋糕甜点': ['麦香烘焙', '甜梦工坊', '初雪蛋糕', '暖心面包房', '蜜糖时光', '法式甜品屋', '日式烧果子', '一口甜蜜', '可可慕斯', '奶油童话'],
  '烤肉': ['炭火之舞', '滋滋烤肉', '韩风烧肉', '原木烤场', '肉食动物', '金牌五花', '牛气冲天', '烤场物语', '夜市烤把', '猛火烤肉'],
  '自助餐': ['海之味自助', '百味汇', '畅想美食城', '环球海鲜盛宴', '绿野素食自助', '大胃王自助', '扶墙出烤肉自助', '金皇冠自助', '阳光美食派对', '星级自助餐厅'],
  '西餐': ['左岸法式西餐', '浪漫意式餐厅', '星空牛排馆', '花园餐吧', '爵士风情餐厅', '复古西餐铺', '白鸽披萨', '黑松露工坊', '时光酒馆', '摩登时代'],
  '日料': ['樱花居酒屋', '深海刺身馆', '深夜食堂日料', '秋田寿司', '板前料理', '和风拉面屋', '京都一梦', '富士山下烤鳗', '一番回转寿司', '御好烧小铺']
};

const dishPool: Record<string, string[]> = {
  '饮品': ['满杯红柚', '芝士莓莓', '多肉葡萄', '波霸奶茶', '杨枝甘露', '四季春茶', '乌龙玛奇朵'],
  '咖啡': ['生椰拿铁', '冰美式', '燕麦拿铁', '焦糖玛奇朵', '摩卡', '手冲瑰夏', '澳白'],
  '火锅': ['鲜切吊龙', '脆毛肚', '手打虾滑', '鸭血', '响铃卷', '现炸酥肉', '宽粉'],
  '地方菜': ['辣椒炒肉', '外婆红烧肉', '酸菜鱼', '宫保鸡丁', '麻婆豆腐', '白切鸡', '葱烧海参'],
  '小吃快餐': ['招牌肉夹馍', '凉皮', '金牌麻辣烫', '炸里脊', '酸辣粉', '小面', '黄焖鸡米饭'],
  '面包蛋糕甜点': ['海盐卷', '脏脏包', '草莓拿破仑', '巴斯克芝士', '芋泥肉松小贝', '半熟芝士', '提拉米苏'],
  '烤肉': ['厚切五花肉', '秘制肥牛', '黑椒牛肋条', '烤蘑菇', '芝士玉米', '烤大肠', '和牛上脑'],
  '自助餐': ['三文鱼刺身', '烤生蚝', '蒜蓉扇贝', '法式羊排', '佛跳墙', '烤大虾', '哈根达斯'],
  '西餐': ['惠灵顿牛排', '黑松露意面', '玛格丽特披萨', '凯撒沙拉', '法式鹅肝', '奶油蘑菇汤', '肉酱千层面'],
  '日料': ['鳗鱼饭', '三文鱼手握', '天妇罗拼盘', '豚骨拉面', '寿喜锅', '日式炸鸡块', '厚蛋烧']
};

const tagPool = ['出片', '学生特惠', '分量足', '服务好', '环境佳', '深夜食堂', '宝藏小店', '一人食', '地道风味', '排队王', '上菜快', '高性价比', '约会', '自习', '夜宵'];

requiredCategories.forEach(cat => {
  const currentCount = mockRestaurants.filter(r => r.category === cat || r.tags.includes(cat)).length;
  if (currentCount < 10) {
    const toAdd = 10 - currentCount;
    for (let i = 0; i < toAdd; i++) {
      const isAllergenFree = Math.random() > 0.5;
      const assignedAllergens = isAllergenFree ? [] : [commonAllergens[Math.floor(Math.random() * commonAllergens.length)]];
      const images = categoryImages[cat] || ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'];
      
      const namePool = realNames[cat] || [];
      const baseName = i < namePool.length ? namePool[i] : `${cat}美食坊 ${i + 1}`;
      
      const dPool = dishPool[cat] || ['招牌菜'];
      const shuffledDishes = [...dPool].sort(() => 0.5 - Math.random());
      
      const shuffledTags = [...tagPool].sort(() => 0.5 - Math.random()).slice(0, 3);
      if (!shuffledTags.includes(cat)) shuffledTags.unshift(cat);
      
      mockRestaurants.push({
        id: `gen-${cat}-${i}`,
        name: baseName,
        category: cat,
        campus: 'bift',
        price: Math.floor(Math.random() * 100) + 15,
        distance: Math.floor(Math.random() * 1000) + 100,
        rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 - 5.0
        image: images[i % images.length],
        tags: shuffledTags,
        location: { lat: 39.9875, lng: 116.3289, description: '附近商圈' },
        popularDishes: shuffledDishes.slice(0, 2),
        votes: { 
          crowded: Math.floor(Math.random() * 200) + 10, 
          delicious: Math.floor(Math.random() * 300) + 50, 
          fast: Math.floor(Math.random() * 200) + 30, 
          slow: Math.floor(Math.random() * 50) 
        },
        verifyVotes: { 
          hasIt: Math.floor(Math.random() * 100) + 20, 
          tasty: Math.floor(Math.random() * 150) + 30, 
          closed: Math.floor(Math.random() * 5) 
        },
        openHours: '10:00-22:00',
        phone: '010-88888888',
        hasAllergenFree: isAllergenFree,
        allergens: assignedAllergens
      });
    }
  }
});

// 给现有的一些餐厅也加上过敏原和场景标签，并全面打乱投票和标签数据
mockRestaurants.forEach((r, idx) => {
    if (!r.allergens) {
        const isAllergenFree = Math.random() > 0.7;
        r.hasAllergenFree = isAllergenFree;
        r.allergens = isAllergenFree ? [] : [commonAllergens[Math.floor(Math.random() * commonAllergens.length)]];
    }
    
    // 如果是老数据（没有被上面重新生成覆盖的）我们把它的tags重做一下让它更有差异性
    // 但是保留原本的 category tag 和一些特定 tag
    const existingTags = r.tags.filter(t => requiredCategories.includes(t) || ['约会', '自习', '夜宵'].includes(t));
    const randomExtraTags = [...tagPool].sort(() => 0.5 - Math.random()).slice(0, 2);
    r.tags = Array.from(new Set([...existingTags, ...randomExtraTags]));
    
    if (idx % 3 === 0 && !r.tags.includes('约会')) r.tags.push('约会');
    if (idx % 4 === 0 && !r.tags.includes('自习')) r.tags.push('自习');
    if (idx % 5 === 0 && !r.tags.includes('夜宵')) r.tags.push('夜宵');

    // 重新随机化所有店的评价数据，使其“全部都要做得不一样”
    r.votes = {
        crowded: Math.floor(Math.random() * 300) + 20,
        delicious: Math.floor(Math.random() * 400) + 80,
        fast: Math.floor(Math.random() * 250) + 40,
        slow: Math.floor(Math.random() * 80)
    };
    r.verifyVotes = {
        hasIt: Math.floor(Math.random() * 150) + 10,
        tasty: Math.floor(Math.random() * 200) + 20,
        closed: Math.floor(Math.random() * 5)
    };
});
