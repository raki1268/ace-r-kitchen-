import { useEffect, useRef } from 'react'

const CELL_SIZE = 40 
const BG_COLOR = '#756accff'
// 简化后的测试图片路径
const TEST_IMAGES = [
  '/images/convenient/bd002-1.jpg',
  '/images/homemake/hm001.jpg',
  '/images/homemake/hm002.jpg',
  '/images/homemake/hm004.jpg'
]

export default function HeaderGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let cells = [], cols = 0, rows = 0, totalCells = 0, destroyed = false

    // 自动处理 Vite 的 base 路径（防止出现 text/html 错误）
    const getCorrectPath = (src) => {
      const base = import.meta.env.BASE_URL.replace(/\/$/, '') // 去掉结尾斜杠
      const cleanSrc = src.startsWith('/') ? src : `/${src}`
      return `${base}${cleanSrc}`.replace(/\/+/g, '/') // 确保没有双斜杠
    }

    const loadImage = (src) => new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => {
        console.error("图片加载依然失败，请检查此地址是否能手动打开:", img.src)
        resolve(null)
      }
      img.src = getCorrectPath(src)
    })

    const initGrid = async () => {
      const parent = canvas.parentElement
      if (!parent) return
      const w = parent.clientWidth, h = parent.clientHeight
      canvas.width = w; canvas.height = h
      cols = Math.ceil(w / CELL_SIZE)
      rows = Math.ceil(h / CELL_SIZE)
      totalCells = cols * rows
      
      cells = Array(totalCells).fill(null).map(() => ({ img: null }))

      // 异步加载一张图并随机分发到 10 个位置
      const loadedImg = await loadImage(TEST_IMAGES[0]) 
      if (!loadedImg || destroyed) return

      const indices = []
      while(indices.length < 10 && indices.length < totalCells) {
        const r = Math.floor(Math.random() * totalCells)
        if(!indices.includes(r)) indices.push(r)
      }

      indices.forEach(idx => { cells[idx].img = loadedImg })
      draw()
    }

    const draw = () => {
      if (destroyed) return
      ctx.fillStyle = BG_COLOR
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      cells.forEach((cell, i) => {
        if (!cell.img) return
        const x = (i % cols) * CELL_SIZE, y = Math.floor(i / cols) * CELL_SIZE
        const s = Math.max(CELL_SIZE / cell.img.naturalWidth, CELL_SIZE / cell.img.naturalHeight)
        ctx.save()
        ctx.beginPath(); ctx.rect(x, y, CELL_SIZE, CELL_SIZE); ctx.clip()
        ctx.globalAlpha = 0.6 
        ctx.drawImage(cell.img, x + (CELL_SIZE - cell.img.naturalWidth * s) / 2, y + (CELL_SIZE - cell.img.naturalHeight * s) / 2, cell.img.naturalWidth * s, cell.img.naturalHeight * s)
        ctx.restore()
      })
    }

    initGrid()
    window.addEventListener('resize', initGrid)
    return () => { destroyed = true; window.removeEventListener('resize', initGrid) }
  }, [])

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
}