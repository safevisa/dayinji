// 产品数据 - 根据建通亚太官网复刻
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  categoryId: string
  category: string
  images: string[]
  specifications: Record<string, string>
  inStock: boolean
  stockQuantity: number
  featured: boolean
  brand: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'products.3d_printers', // 使用翻译键
    slug: '3d-printers',
    description: 'products.3d_printers_desc',
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
    productCount: 8
  },
  {
    id: '2', 
    name: 'products.printing_materials',
    slug: 'materials',
    description: 'products.printing_materials_desc',
    image: 'https://images.unsplash.com/photo-1593440552154-a4e1b2c2fecc?w=400&h=300&fit=crop',
    productCount: 15
  },
  {
    id: '3',
    name: 'products.post_processing',
    slug: 'post-processing',
    description: 'products.post_processing_desc',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=300&fit=crop', 
    productCount: 6
  },
  {
    id: '4',
    name: 'products.3d_scanners',
    slug: '3d-scanners',
    description: 'products.3d_scanners_desc',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    productCount: 4
  },
  {
    id: '5',
    name: 'products.laser_cutting',
    slug: 'laser-cutting',
    description: 'products.laser_cutting_desc',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop',
    productCount: 3
  }
]

export const products: Product[] = [
  // 3D列印機 - 正常價格區間
  {
    id: '1',
    name: 'Phrozen Sonic Mighty Revo 16K',
    description: '全新登場｜極致細節，無可挑剔。超細緻列印，肉眼無層紋，免打磨直接用！航太級鋁合金結構＋雙線性導軌，穩定可靠，通宵趕工也不失手。30分鐘預熱，恆溫列印品質滿分。搭載智慧提醒與遠端監控，效率與安心一次到位。',
    price: 899.99,
    originalPrice: 999.99,
    currency: 'USD',
    categoryId: '1',
    category: '3D 列印機',
    images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=500&fit=crop'],
    specifications: {
      '列印體積': '218.88 × 123 × 235 mm',
      '層厚精度': '0.01-0.3mm', 
      '列印速度': '30-50mm/h',
      '螢幕規格': '16K Mono LCD',
      '光源': 'UV LED Array'
    },
    inStock: true,
    stockQuantity: 15,
    featured: true,
    brand: 'Phrozen 普羅森'
  },
  {
    id: '2', 
    name: 'Phrozen Arco 高階 FDM 3D 列印機套組',
    description: '現貨熱銷｜大、快、穩 — 300×300×300mm列印體積、最高1,000mm/s，高速又可靠。多色創作 — Chroma Kit四色列印＋智慧烘料系統，切換快50%。專用外罩 — 五面強化玻璃模組，維持安靜、恆溫，品質更穩定。',
    price: 1299.99,
    currency: 'USD',
    categoryId: '1',
    category: '3D 列印機', 
    images: ['https://images.unsplash.com/photo-1612198985863-fbbf7b95b2c4?w=500&h=500&fit=crop'],
    specifications: {
      '列印體積': '300 × 300 × 300 mm',
      '列印速度': '最高 1,000mm/s',
      '線材規格': '1.75mm',
      '噴嘴溫度': '最高280°C',
      '列印平台': '自動調平'
    },
    inStock: true,
    stockQuantity: 8,
    featured: true,
    brand: 'Phrozen 普羅森'
  },
  {
    id: '3',
    name: 'Formlabs Form 3+ 光固化3D列印機',
    description: '專業級SLA 3D列印機，提供無與倫比的列印品質和可靠性。適合原型製作、小批量生產和專業應用。',
    price: 2499.99,
    currency: 'USD',
    categoryId: '1', 
    category: '3D 列印機',
    images: ['https://images.unsplash.com/photo-1593440552154-a4e1b2c2fecc?w=500&h=500&fit=crop'],
    specifications: {
      '列印體積': '145 × 145 × 185 mm',
      '層厚精度': '0.025mm',
      '光源': 'LED光源陣列',
      '樹脂槽': '可重複使用LT樹脂槽'
    },
    inStock: true,
    stockQuantity: 5,
    featured: false,
    brand: 'Formlabs 風雷'
  },
  {
    id: '4',
    name: 'Bambu Lab X1-Carbon 多色3D列印機',
    description: '創新的多色列印技術，自動換色系統，適合複雜多彩列印需求。',
    price: 1199.99,
    currency: 'USD',
    categoryId: '1',
    category: '3D 列印機',
    images: ['https://images.unsplash.com/photo-1563089145-599997674d42?w=500&h=500&fit=crop'],
    specifications: {
      '列印體積': '256 × 256 × 256 mm',
      '自動換色': '支援16色自動切換', 
      '列印速度': '最高500mm/s',
      '智慧功能': 'AI故障檢測'
    },
    inStock: true,
    stockQuantity: 12,
    featured: false,
    brand: 'Bambu Lab 拓竹'
  },

  // 列印材料 - 19.9-39.9美金區間
  {
    id: '5',
    name: 'Phrozen 普羅森 標準樹脂 - 透明',
    description: '高品質標準樹脂，適合各種列印需求。低氣味配方，列印效果優異。',
    price: 29.99,
    originalPrice: 34.99,
    currency: 'USD',
    categoryId: '2',
    category: '列印材料',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'],
    specifications: {
      '容量': '1000ml',
      '顏色': '透明',
      '固化時間': '8-12秒',
      '黏度': '200-300 cPs'
    },
    inStock: true,
    stockQuantity: 50,
    featured: true,
    brand: 'Phrozen 普羅森'
  },
  {
    id: '6',
    name: 'Phrozen 普羅森 高韌性樹脂',
    description: '專為需要高強度和韌性的應用設計，適合功能性零件列印。',
    price: 39.99,
    currency: 'USD', 
    categoryId: '2',
    category: '列印材料',
    images: ['https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=500&h=500&fit=crop'],
    specifications: {
      '容量': '1000ml',
      '特性': '高韌性、抗衝擊',
      '固化時間': '10-15秒',
      '顏色': '灰色'
    },
    inStock: true,
    stockQuantity: 30,
    featured: false,
    brand: 'Phrozen 普羅森'
  },
  {
    id: '7', 
    name: 'Formlabs Grey Resin V4 標準樹脂',
    description: 'Formlabs最受歡迎的樹脂，提供優秀的細節表現和表面光潔度。',
    price: 35.99,
    currency: 'USD',
    categoryId: '2',
    category: '列印材料', 
    images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=500&fit=crop'],
    specifications: {
      '容量': '1L',
      '顏色': '灰色',
      '拉伸強度': '65 MPa',
      '適用機型': 'Form 2, Form 3/3B/3+'
    },
    inStock: true,
    stockQuantity: 25,
    featured: false,
    brand: 'Formlabs 風雷'
  },
  {
    id: '8',
    name: 'PLA+ 高品質線材 - 多色可選',
    description: '優質PLA+線材，列印穩定，顏色豐富。適合初學者和專業用戶。',
    price: 24.99,
    currency: 'USD',
    categoryId: '2',
    category: '列印材料',
    images: ['https://images.unsplash.com/photo-1612198985863-fbbf7b95b2c4?w=500&h=500&fit=crop'], 
    specifications: {
      '重量': '1KG',
      '直徑': '1.75mm',
      '列印溫度': '210-230°C',
      '平台溫度': '60-80°C'
    },
    inStock: true,
    stockQuantity: 100,
    featured: true,
    brand: 'Enlighten 陽明'
  },
  {
    id: '9',
    name: 'PETG 透明線材',
    description: '高透明度PETG線材，化學穩定性好，適合製作透明零件。',
    price: 32.99,
    currency: 'USD',
    categoryId: '2',
    category: '列印材料',
    images: ['https://images.unsplash.com/photo-1593440552154-a4e1b2c2fecc?w=500&h=500&fit=crop'],
    specifications: {
      '重量': '1KG',
      '直徑': '1.75mm', 
      '透明度': '高透明',
      '列印溫度': '230-250°C'
    },
    inStock: true,
    stockQuantity: 40,
    featured: false,
    brand: 'Pancolour 磐采'
  },
  {
    id: '10',
    name: '水溶性支撐材料 PVA',
    description: '水溶性支撐材料，完美適合複雜結構列印，支撐易於去除。',
    price: 39.99,
    currency: 'USD',
    categoryId: '2',
    category: '列印材料',
    images: ['https://images.unsplash.com/photo-1563089145-599997674d42?w=500&h=500&fit=crop'],
    specifications: {
      '重量': '0.5KG',
      '直徑': '1.75mm',
      '溶解': '水溶性',
      '列印溫度': '180-200°C'
    },
    inStock: true,
    stockQuantity: 20,
    featured: false,
    brand: 'Pancolour 磐采'
  },
  {
    id: '11',
    name: '專業樹脂清洗劑',
    description: '專為樹脂3D列印設計的清洗劑，快速去除未固化樹脂。',
    price: 19.99,
    currency: 'USD',
    categoryId: '2',
    category: '列印材料',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'],
    specifications: {
      '容量': '1L',
      '成分': '異丙醇95%',
      '用途': '樹脂清洗',
      '安全性': '低毒環保配方'
    },
    inStock: true,
    stockQuantity: 60,
    featured: false,
    brand: 'Enlighten 陽明'
  },

  // 後處理設備 - 正常價格
  {
    id: '12',
    name: '專業UV固化清洗工作站',
    description: '二合一設計，同時具備清洗和UV固化功能。提升後處理效率。',
    price: 299.99,
    originalPrice: 349.99,
    currency: 'USD',
    categoryId: '3',
    category: '後處理設備',
    images: ['https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=500&h=500&fit=crop'],
    specifications: {
      'UV功率': '40W',
      '清洗容量': '2L',
      '固化時間': '可調1-60分鐘',
      '轉盤': '360度旋轉'
    },
    inStock: true,
    stockQuantity: 15,
    featured: true,
    brand: 'Generic'
  },
  {
    id: '13',
    name: '空氣清淨過濾系統',
    description: '專業級空氣淨化設備，有效過濾樹脂異味和有害氣體。',
    price: 399.99,
    currency: 'USD',
    categoryId: '3',
    category: '後處理設備', 
    images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=500&fit=crop'],
    specifications: {
      '過濾效率': '99.97%',
      '適用面積': '20-30平方米',
      '噪音': '<45dB',
      '濾網': 'HEPA+活性碳'
    },
    inStock: true,
    stockQuantity: 10,
    featured: false,
    brand: 'Generic'
  },

  // 3D掃描器 - 正常價格
  {
    id: '14',
    name: 'Shining3D EinScan-SP 桌面型3D掃描器',
    description: '高精度桌面型3D掃描器，適合小到中型物件的快速掃描。',
    price: 2999.99,
    currency: 'USD',
    categoryId: '4',
    category: '3D掃描器',
    images: ['https://images.unsplash.com/photo-1612198985863-fbbf7b95b2c4?w=500&h=500&fit=crop'],
    specifications: {
      '掃描精度': '0.1mm',
      '掃描速度': '1.5秒/次',
      '掃描體積': '最大300×300×300mm',
      '紋理掃描': '支援'
    },
    inStock: true,
    stockQuantity: 3,
    featured: false,
    brand: 'Shining3D 先臨三維'
  },
  {
    id: '15',
    name: 'CREALITY CR-Scan Lizard 手持式3D掃描器',
    description: '便攜式手持3D掃描器，操作簡單，適合快速建模需求。',
    price: 799.99,
    currency: 'USD',
    categoryId: '4',
    category: '3D掃描器',
    images: ['https://images.unsplash.com/photo-1593440552154-a4e1b2c2fecc?w=500&h=500&fit=crop'],
    specifications: {
      '掃描精度': '0.1mm',
      '掃描範圍': '150×150×150mm',
      '重量': '105g',
      '連接': 'USB-C'
    },
    inStock: true,
    stockQuantity: 8,
    featured: false,
    brand: 'CREALITY 創想'
  },

  // 雷切雷雕機 - 正常價格
  {
    id: '16',
    name: 'Cubiio2 便攜式雷射雕刻機',
    description: '輕巧便攜的雷射雕刻機，支援多種材料雕刻切割。',
    price: 599.99,
    currency: 'USD',
    categoryId: '5',
    category: '雷切/雷雕機',
    images: ['https://images.unsplash.com/photo-1563089145-599997674d42?w=500&h=500&fit=crop'],
    specifications: {
      '雷射功率': '5.5W',
      '雕刻面積': '100×100mm',
      '重量': '1.2KG',
      '連接方式': 'WiFi + USB'
    },
    inStock: true,
    stockQuantity: 12,
    featured: false,
    brand: 'Cubiio'
  }
]

// 特色產品
export const featuredProducts = products.filter(p => p.featured)

// 促銷活動
export const promotions = [
  {
    id: '1',
    title: 'Phrozen樹脂3件88折',
    description: '購買任意3件Phrozen樹脂產品，享受88折優惠',
    discount: 12,
    validUntil: '2024-12-31',
    applicableProducts: products.filter(p => p.brand.includes('Phrozen') && p.categoryId === '2')
  },
  {
    id: '2', 
    title: '現貨優惠活動',
    description: '指定商品現貨供應，立即發貨',
    discount: 0,
    validUntil: '2024-10-31',
    applicableProducts: products.filter(p => p.stockQuantity > 10)
  }
]

// 服務項目
export const services = [
  {
    id: '1',
    name: '3D列印代工',
    description: '提供專業3D列印代工服務，多種材料可選',
    icon: 'printer',
    features: ['快速交期', '多材料選擇', '品質保證', '批量優惠']
  },
  {
    id: '2', 
    name: '3D掃描代工',
    description: '高精度3D掃描服務，適合逆向工程需求',
    icon: 'scan',
    features: ['高精度掃描', '多格式輸出', '專業處理', '快速交付']
  },
  {
    id: '3',
    name: '3D設計代工',
    description: '專業3D建模設計服務，從概念到成品',
    icon: 'design', 
    features: ['原創設計', '修改調整', '技術諮詢', '設計優化']
  }
]
