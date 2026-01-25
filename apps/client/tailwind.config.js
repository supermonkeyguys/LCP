/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    // --- 核心修复：添加 Safelist ---
    // 这告诉 Tailwind：“不管你怎么优化，把下面这些样式的 CSS 必须给我留着！”
    safelist: [
      // 强制生成所有常用颜色的背景、文字、边框
      {
        pattern: /(bg|text|border)-(red|green|blue|purple|yellow|gray|indigo|pink)-(50|100|200|300|400|500|600|700|800|900|950)/,
      },
      // 强制生成常用间距 padding/margin (p-1 到 p-10)
      {
          pattern: /(m|p)(t|b|l|r|x|y)?-(0|1|2|3|4|5|6|8|10|12)/,
      },
      // 强制生成常用圆角和阴影
      'rounded', 'rounded-md', 'rounded-lg', 'rounded-full',
      'shadow', 'shadow-md', 'shadow-lg',
      'flex', 'items-center', 'justify-center', // 常用布局
    ],
    plugins: [],
  }