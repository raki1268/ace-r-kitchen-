// 分类配置
export const CATEGORIES = {
  '便当': {
    id: 'bento',
    color: '#E8934A',
    icon: '🍱',
    order: 0,
  },
  '自煮': {
    id: 'homemade',
    color: '#A4C76E',
    icon: '👨‍🍳',
    order: 1,
  },
  '外卖': {
    id: 'takeout',
    color: '#F5A962',
    icon: '🛵',
    order: 2,
  },
  'Bakery': {
    id: 'bakery',
    color: '#D4A574',
    icon: '🧁',
    order: 3,
  },
  '餐厅': {
    id: 'restaurant',
    color: '#C77B7B',
    icon: '🍽️',
    order: 4,
  },
};

// 社交媒体链接
export const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    icon: '🔗',
    url: 'https://github.com',
    label: 'GitHub',
  },
  {
    name: 'Instagram',
    icon: '📷',
    url: 'https://instagram.com',
    label: 'Instagram',
  },
  {
    name: 'WeChat',
    icon: '💬',
    url: '#',
    label: 'WeChat',
  },
];

// 颜色配置
export const COLORS = {
  cream: '#F5F1ED',
  charcoal: '#2C2C2C',
  orange: '#E8934A',
  green: '#A4C76E',
  beige: '#E8DCC8',
};

// 站点信息
export const SITE_INFO = {
  title: "Ace.R's Kitchen",
  subtitle: '家庭三餐精选',
  description: '记录每一顿美味的故事',
  year: new Date().getFullYear(),
};