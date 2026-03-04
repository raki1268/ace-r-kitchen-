// Bakery 品类数据集中管理
export const bakeryData = [
  {
    id: 'bk001',
    name: 'Kiwi奥利奥慕斯蛋糕',
    date: '2025-03',
    rating: 5,
    images: ['public/images/bakery/bk001.jpg'],
    ingredients: ['黑芝麻粉 100g', '糯米粉 150g', '糖 60g', '牛奶 100ml', '黄油 30g'],
    steps: [
      '混合黑芝麻粉和糯米粉',
      '加入牛奶和融化的黄油搅拌均匀',
      '铺入烤盘，平整表面',
      '180°C烤20-25分钟至金黄',
      '冷却后切块即可'
    ],
    notes: '口感软糯，黑芝麻香气十足，很解馋',
    makingTime: 45,
    cuisine: '甜点'
  },
  {
    id: 'bk002',
    name: '抹茶提拉米苏',
    date: '2025-01',
    rating: 5,
    images: ['public/images/bakery/bk002.jpg'],
    ingredients: ['手指饼', '抹茶粉 20g', '马斯卡彭芝士 250g', '糖', '牛奶'],
    steps: [
      '手指饼浸泡在抹茶牛奶中',
      '混合马斯卡彭和糖至顺滑',
      '铺一层手指饼，再铺一层芝士',
      '重复至满满',
      '冷冻4小时，撒抹茶粉'
    ],
    notes: '抹茶的清香和芝士的浓郁完美融合，甜度刚好',
    makingTime: 60,
    cuisine: '甜点'
  },
  {
    id: 'bk003',
    name: '榴莲千层蛋糕',
    date: '2025-01',
    rating: 5,
    images: ['public/images/bakery/bk003.jpg'],
    ingredients: ['千层皮', '榴莲果肉 300g', '淡奶油 500ml', '糖', '黄油'],
    steps: [
      '煎薄饼皮至金黄，一层层铺好',
      '打发淡奶油加糖',
      '榴莲肉混入奶油中',
      '夹在饼皮之间交替铺放',
      '冷藏4小时后切块享用'
    ],
    notes: '榴莲的王道吃法！尽管价格贵但真的值得',
    makingTime: 90,
    cuisine: '甜点'
  },
  {
    id: 'bk004',
    name: '草莓芝士蛋糕',
    date: '2025-02',
    rating: 4.5,
    images: ['public/images/bakery/bk004.jpg'],
    ingredients: ['消化饼 150g', '黄油 60g', '奶油芝士 300g', '牛奶 100ml', '糖 80g', '草莓'],
    steps: [
      '消化饼碎混合黄油铺底',
      '混合芝士、牛奶、糖制作填料',
      '倒入饼底',
      '烤箱200°C烤30分钟',
      '冷却后冷藏4小时，装饰草莓'
    ],
    notes: '酸甜适中，奶油感十足，草莓新鲜又漂亮',
    makingTime: 75,
    cuisine: '甜点'
  },
  {
    id: 'bk005',
    name: '巧克力熔浆蛋糕',
    date: '2025-02',
    rating: 5,
    images: ['public/images/bakery/bk005.jpg'],
    ingredients: ['黑巧克力 200g', '黄油 100g', '鸡蛋 3个', '糖 80g', '面粉 40g'],
    steps: [
      '巧克力和黄油水浴融化',
      '鸡蛋和糖打发至浓稠',
      '混合巧克力和鸡蛋液',
      '轻轻拌入面粉',
      '175°C烤12-15分钟至外硬内软'
    ],
    notes: '切开时巧克力浆缓缓流出，绝对的诱人甜蜜',
    makingTime: 40,
    cuisine: '甜点'
  },
  {
    id: 'bk018',
    name: '樱花季限定',
    date: '2025-03',
    rating: 5,
    images: [
      'public/images/bakery/bk018_1.jpg',
      'public/images/bakery/bk018_2.jpg',
      'public/images/bakery/bk018_3.jpg',
      'public/images/bakery/bk018_4.jpg',
      'public/images/bakery/bk018_5.jpg',
      'public/images/bakery/bk018_6.jpg',
      'public/images/bakery/bk018_7.jpg',
      'public/images/bakery/bk018_8.jpg'
    ],
    ingredients: ['樱花粉', '牛奶', '黄油', '鸡蛋', '面粉', '糖'],
    steps: [
      '准备樱花粉液',
      '黄油和糖打发',
      '加入鸡蛋混合',
      '拌入樱花粉和面粉',
      '倒入模具',
      '烤箱180°C烤25分钟',
      '脱模冷却',
      '装饰樱花花瓣'
    ],
    notes: '春天的限定款，粉嫩樱花色，淡雅樱花香',
    makingTime: 50,
    cuisine: '甜点'
  },
  {
    id: 'bk019',
    name: '蜂蜜南瓜派',
    date: '2025-02',
    rating: 4,
    images: ['public/images/bakery/bk019.jpg'],
    ingredients: ['南瓜 400g', '酥皮', '鸡蛋 2个', '牛奶 100ml', '蜂蜜 3汤匙', '肉桂粉'],
    steps: [
      '南瓜蒸软打成泥',
      '混合鸡蛋、牛奶、蜂蜜',
      '加入南瓜泥和肉桂粉',
      '倒入派皮',
      '350°F烤50分钟'
    ],
    notes: '温暖的南瓜香，完美的秋日下午茶',
    makingTime: 70,
    cuisine: '甜点'
  },
  {
    id: 'bk020',
    name: '柠檬挞',
    date: '2025-02',
    rating: 4.5,
    images: ['public/images/bakery/bk020.jpg'],
    ingredients: ['黄油挞皮', '鸡蛋 3个', '淡奶油 100ml', '柠檬 2个', '糖 100g'],
    steps: [
      '挞皮铺入模具',
      '混合鸡蛋、奶油、柠檬汁和糖',
      '倒入挞皮',
      '200°C烤25分钟至金黄',
      '冷却撒糖粉'
    ],
    notes: '酸甜爽口，柠檬的清香在口中绽放',
    makingTime: 45,
    cuisine: '甜点'
  },
  {
    id: 'bk021',
    name: '红丝绒纸杯蛋糕',
    date: '2025-01',
    rating: 4.5,
    images: ['public/images/bakery/bk021.jpg'],
    ingredients: ['面粉 180g', '红色食用色素', '食用油 120ml', '白醋', '牛奶', '糖 200g', '鸡蛋 2个'],
    steps: [
      '混合干性材料',
      '混合湿性材料和食用色素',
      '合并干湿材料',
      '倒入纸杯',
      '350°F烤20-22分钟',
      '冷却后涂奶油芝士糖霜'
    ],
    notes: '优雅的红色，甜而不腻的口感，很有质感',
    makingTime: 55,
    cuisine: '甜点'
  },
  {
    id: 'bk022',
    name: '焦糖布丁',
    date: '2025-01',
    rating: 4,
    images: ['public/images/bakery/bk022.jpg'],
    ingredients: ['糖 150g', '牛奶 400ml', '淡奶油 200ml', '鸡蛋 3个', '香草精'],
    steps: [
      '制作焦糖液倒入布丁杯',
      '加热牛奶和奶油',
      '鸡蛋打发加糖',
      '混合混合物',
      '水浴烤40分钟',
      '冷藏4小时'
    ],
    notes: '焦糖的苦甜和蛋液的嫩滑完美平衡',
    makingTime: 60,
    cuisine: '甜点'
  },
  {
    id: 'bk023',
    name: '开心果白巧克力饼干',
    date: '2025-01',
    rating: 4.5,
    images: ['public/images/bakery/bk023.jpg'],
    ingredients: ['黄油 100g', '糖 80g', '鸡蛋 1个', '面粉 180g', '白巧克力块', '开心果'],
    steps: [
      '黄油和糖打发',
      '加入鸡蛋',
      '拌入面粉',
      '加入巧克力和坚果',
      '铺烤盘',
      '375°F烤12分钟'
    ],
    notes: '香脆可口，白巧的甜和开心果的香很搭',
    makingTime: 35,
    cuisine: '甜点'
  },
  {
    id: 'bk024',
    name: '抹茶白巧克力蛋糕卷',
    date: '2025-03',
    rating: 5,
    images: ['public/images/bakery/bk024.jpg'],
    ingredients: ['鸡蛋 4个', '糖 60g', '面粉 50g', '抹茶粉 10g', '牛奶 40ml', '白巧克力', '淡奶油'],
    steps: [
      '蛋白蛋黄分离打发',
      '混合面粉和抹茶粉',
      '烤盘铺油纸倒入面糊',
      '350°F烤15分钟',
      '白巧克力奶油混合',
      '趁热卷起冷却'
    ],
    notes: '抹茶的清苦配白巧的甜，层次丰富',
    makingTime: 55,
    cuisine: '甜点'
  },
  {
    id: 'bk025',
    name: '樱桃马芬蛋糕',
    date: '2025-02',
    rating: 4,
    images: ['public/images/bakery/bk025.jpg'],
    ingredients: ['面粉 200g', '糖 80g', '鸡蛋 2个', '牛奶 150ml', '黄油 80g', '新鲜樱桃', '泡打粉'],
    steps: [
      '黄油融化加糖和鸡蛋',
      '加入牛奶',
      '拌入面粉和泡打粉',
      '放入樱桃',
      '倒入马芬模',
      '350°F烤20分钟'
    ],
    notes: '酸甜的樱桃融入蛋糕里，每一口都能吃到',
    makingTime: 40,
    cuisine: '甜点'
  },
  {
    id: 'bk026',
    name: '黑森林蛋糕',
    date: '2025-03',
    rating: 5,
    images: ['public/images/bakery/bk026.jpg'],
    ingredients: ['黑巧克力', '樱桃', '鲜奶油', '巧克力碎', '可可粉', '鸡蛋'],
    steps: [
      '烤巧克力蛋糕体',
      '樱桃去核准备',
      '打发鲜奶油',
      '组合蛋糕和奶油',
      '装饰巧克力碎和可可粉',
      '冷藏2小时'
    ],
    notes: '经典的黑森林，华丽又不失优雅',
    makingTime: 120,
    cuisine: '甜点'
  }
];