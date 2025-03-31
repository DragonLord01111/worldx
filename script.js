const img = document.getElementById("image");
const container = document.querySelector(".container");

let scale = 1;
let isDragging = false;
let startX, startY, imgX = 0, imgY = 0;
let lastScale = 1;
let velocityX = 0, velocityY = 0;
let momentumActive = false;

const MIN_SCALE = 0.5;
const MAX_SCALE = 8;

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

    // Обмеження масштабу
    if (newScale < MIN_SCALE || newScale > MAX_SCALE) return;

    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    imgX -= (mouseX - rect.width / 2) * (newScale - scale) / scale;
    imgY -= (mouseY - rect.height / 2) * (newScale - scale) / scale;

    scale = newScale;
    updateTransform(true);
});

// Початок переміщення
container.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;

    isDragging = true;
    momentumActive = false;
    startX = event.clientX - imgX;
    startY = event.clientY - imgY;
    velocityX = 0;
    velocityY = 0;
    img.style.cursor = "grabbing";
});

// Переміщення
container.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    let newX = event.clientX - startX;
    let newY = event.clientY - startY;

    velocityX = newX - imgX;
    velocityY = newY - imgY;

    imgX = newX;
    imgY = newY;

    updateTransform();
});

// Завершення перетягування (додаємо інерцію)
container.addEventListener("mouseup", () => {
    isDragging = false;
    img.style.cursor = "grab";

    // Інерція руху після відпускання миші
    if (Math.abs(velocityX) > 1 || Math.abs(velocityY) > 1) {
        momentumActive = true;
        requestAnimationFrame(applyMomentum);
    }
});

// Інерційний рух (плавне уповільнення)
function applyMomentum() {
    if (!momentumActive) return;

    imgX += velocityX;
    imgY += velocityY;

    velocityX *= 0.95;
    velocityY *= 0.95;

    if (Math.abs(velocityX) < 0.5 && Math.abs(velocityY) < 0.5) {
        momentumActive = false;
    }

    updateTransform();
    if (momentumActive) requestAnimationFrame(applyMomentum);
}

// Запобігання залипанню при виході за межі вікна
document.addEventListener("mouseleave", () => {
    isDragging = false;
    img.style.cursor = "grab";
});

// Центрування при завантаженні
window.onload = () => updateTransform(true);
