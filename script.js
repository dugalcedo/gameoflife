const resolution = 100
const resolutionX = resolution
let resolutionY = 0

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

let grid

let animation
let interval = 67

window.addEventListener('resize', ()=>{
    clearInterval(animation)
    start()
})
function start() {
    resizeCanvas()
    createGrid()
    draw()
    setInterval(() => {
        step()
        draw()
    }, interval);
}

window.addEventListener('DOMContentLoaded', start)

function resizeCanvas() {
    canvas.width = window.innerWidth - 25
    canvas.height = window.innerHeight - 25
    makeCanvasEven()
    let ratio = canvas.height / canvas.width
    resolutionY = Math.ceil(resolutionX * ratio)
    while (canvas.height%resolutionY) resolutionY ++
}

function createGrid() {
    let result = Array.from(Array(resolution)).map(col => {
        return Array.from(Array(resolutionY)).map(cell => {
            return Math.round(Math.random())
        })
    })
    grid = result
}

function draw() {
    let size = Math.ceil(canvas.width / resolution)
    grid.forEach((col, colIndex) => {
        const x = colIndex * size
        col.forEach((cell, cellIndex) => {
            const y = cellIndex * size
            c.beginPath()
            c.rect(x, y, size, size)
            c.fillStyle = cell ? 'white' : 'black'
            c.fill()
        })
    })
}

function makeCanvasEven() {
    while (canvas.width%resolution) {canvas.width --}
    while (canvas.height%resolution) {canvas.height --}
}

function getNeighbors(colIndex, cellIndex) {
    let left = grid[colIndex - 1] || []
    let middle = grid[colIndex]
    let right = grid[colIndex + 1] || []
    let above = cellIndex - 1
    let below = cellIndex + 1
    let neighbors = 0 +
        (left[above] || 0) +
        (middle[above] || 0) +
        (right[above] || 0) +

        (left[colIndex] || 0) +
        (right[colIndex] || 0) +

        (left[below] || 0) +
        (middle[below] || 0) +
        right[below]
    return neighbors
}

function step() {
    let newGrid = grid
    grid.forEach((col, colIndex) => {
        col.forEach((cell, cellIndex) => {
            let neighbors = getNeighbors(colIndex, cellIndex)
            if (cell === 1) {
                if (neighbors < 2 || neighbors > 3) {
                    newGrid[colIndex][cellIndex] = 0
                }
            } else if (neighbors === 3) {
                newGrid[colIndex][cellIndex] = 1
            }
        })
    })
    grid = newGrid
}