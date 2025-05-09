const img = document.getElementById("image");
const container = document.querySelector(".container");

let scale = 1;
let imgX = 0, imgY = 0;

const MIN_SCALE = 0.5;
const MAX_SCALE = 8;
const MOVE_STEP = 50;

// Оновлення стилю трансформації
function updateTransform(smooth = false) {
    img.style.transition = smooth ? "transform 0.2s ease-out" : "none";
    img.style.transform = `translate(${imgX}px, ${imgY}px) scale(${scale})`;
}

// Масштабування колесом миші з центруванням
container.addEventListener("wheel", (event) => {
    event.preventDefault();

    let rect = img.getBoundingClientRect();
    let zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    let newScale = scale * zoomFactor;

    if (newScale < MIN_SCALE || newScale > MAX_SCALE) return;

    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    imgX -= (mouseX - rect.width / 2) * (newScale - scale) / scale;
    imgY -= (mouseY - rect.height / 2) * (newScale - scale) / scale;

    scale = newScale;
    updateTransform(true);
});

// Клавіші для переміщення
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            imgY += MOVE_STEP;
            break;
        case "ArrowDown":
            imgY -= MOVE_STEP;
            break;
        case "ArrowLeft":
            imgX += MOVE_STEP;
            break;
        case "ArrowRight":
            imgX -= MOVE_STEP;
            break;
        default:
            return;
    }
    updateTransform(true);
});

// Центрування при завантаженні
window.onload = () => updateTransform(true);
