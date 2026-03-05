import React from 'react';

export default function ShareActions({ onPrint }) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // 这里可以使用你喜欢的 Toast 提示，简单起见用 alert
    alert('🔗 链接已复制到剪贴板！');
  };

  return (
    <div className="flex items-center gap-3 no-print">
      {/* 分享按钮 */}
      <button
        onClick={handleCopyLink}
        className="group flex items-center gap-2 px-4 py-2 bg-white border border-orange/20 rounded-full shadow-sm hover:bg-orange hover:text-white transition-all duration-300"
        title="分享链接"
      >
        <span className="text-lg group-hover:scale-125 transition-transform">🔗</span>
        <span className="text-xs font-medium hidden md:inline">分享给朋友</span>
      </button>

      {/* 打印按钮 */}
      <button
        onClick={onPrint || (() => window.print())}
        className="group flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-full shadow-lg shadow-orange/20 hover:bg-orange-600 hover:-translate-y-0.5 transition-all duration-300"
        title="打印或保存PDF"
      >
        <span className="text-lg group-hover:rotate-12 transition-transform">🖨️</span>
        <span className="text-xs font-bold hidden md:inline">保存配方卡</span>
      </button>
    </div>
  );
}