// База анкет
const profiles = [
    {
        name: "Аліса",
        age: 19,
        bio: "Слухаю Crystal Castles, гуляю вночі, обожнюю оверсайз худі та плівкові фото.",
        tags: ["Goth / Alt", "1.72 м", "Київ"],
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Мілана",
        age: 21,
        bio: "Кіберпанк естетика, рейви, кава без цукру і нескінченний плейлист фонку.",
        tags: ["E-Girl", "Cyberpunk", "Львів"],
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Єва",
        age: 20,
        bio: "Шукаю того, з ким можна дивитися аніме до ранку та малювати скетчі.",
        tags: ["Anime", "Vintage", "Одеса"],
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Кіра",
        age: 22,
        bio: "Татуювання, чорна кава, пост-панк та повний ігнор токсичності.",
        tags: ["Post-punk", "Tattoo", "Харків"],
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=80"
    }
];

const viewport = document.getElementById('cardsViewport');
let currentIndex = 0;
let isAnimating = false;

function createCardElement(data, index) {
    const card = document.createElement('article');
    card.className = 'feed-card';
    card.dataset.index = index;

    card.innerHTML = `
        <div class="card-media" style="background-image: url('${data.image}')"></div>
        <div class="card-content">
            <span class="badge-verified"><i class="fa-solid fa-check"></i> Перевірена анкета</span>
            <h2 class="card-title">${data.name} <span class="age">${data.age}</span></h2>
            <div class="card-tags">
                ${data.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <p class="card-bio">${data.bio}</p>
            <div class="card-actions">
                <button class="action-circle dislike" onclick="swipe('next')" aria-label="Скіп"><i class="fa-solid fa-xmark"></i></button>
                <button class="action-circle like" onclick="swipe('next')" aria-label="Лайк"><i class="fa-solid fa-heart"></i></button>
            </div>
        </div>
    `;
    return card;
}

// Рендеримо картки у стек (TikTok/Tinder stack)
function renderStack() {
    viewport.innerHTML = '';
    for (let i = profiles.length - 1; i >= currentIndex; i--) {
        const card = createCardElement(profiles[i], i);
        const offset = i - currentIndex;

        // Ефект глибини стопки
        if (offset === 0) {
            card.style.transform = `translateY(0px) scale(1)`;
            card.style.opacity = '1';
            card.style.zIndex = '10';
            initDrag(card);
        } else if (offset === 1) {
            card.style.transform = `translateY(22px) scale(0.94)`;
            card.style.opacity = '0.7';
            card.style.zIndex = '9';
        } else {
            card.style.transform = `translateY(40px) scale(0.88)`;
            card.style.opacity = '0.3';
            card.style.zIndex = '8';
        }
        viewport.appendChild(card);
    }
}

// Логіка перемикання (TikTok-style Vertical Swipe)
function swipe(direction = 'next') {
    if (isAnimating) return;
    const activeCard = viewport.querySelector(`.feed-card[data-index="${currentIndex}"]`);
    if (!activeCard) return;

    isAnimating = true;

    if (direction === 'next') {
        // Плавний відліт вгору з обертанням і розмиттям
        activeCard.style.transform = `translateY(-120vh) rotate(-8deg) scale(0.85)`;
        activeCard.style.opacity = '0';

        setTimeout(() => {
            currentIndex++;
            if (currentIndex >= profiles.length) {
                currentIndex = 0; // Зациклюємо коло анкет
            }
            renderStack();
            isAnimating = false;
        }, 400);
    } else if (direction === 'prev' && currentIndex > 0) {
        currentIndex--;
        renderStack();
        isAnimating = false;
    } else {
        isAnimating = false;
    }
}

// Перетягування мишкою та тачем (Drag & Touch)
function initDrag(card) {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const onStart = (e) => {
        if (isAnimating) return;
        isDragging = true;
        startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        card.classList.add('dragging');
    };

    const onMove = (e) => {
        if (!isDragging) return;
        currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        const deltaY = currentY - startY;

        // Додаємо невеликий нахил картки при перетягуванні
        const rotate = (deltaY / 25).toFixed(2);
        card.style.transform = `translateY(${deltaY}px) rotate(${rotate}deg)`;
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('dragging');
        const deltaY = currentY - startY;

        // Якщо свайпнули вгору більше ніж на 90px — перемикаємо
        if (deltaY < -90) {
            swipe('next');
        } else {
            // Повертаємо на місце
            card.style.transform = 'translateY(0px) rotate(0deg) scale(1)';
        }
    };

    card.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    card.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
}

// Керування клавіатурою: W, S, стрілки вгору/вниз
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') {
        e.preventDefault();
        swipe('next');
    } else if (key === 's' || key === 'arrowdown') {
        e.preventDefault();
        swipe('prev');
    }
});

// Колесо миші
let wheelTimeout;
window.addEventListener('wheel', (e) => {
    if (wheelTimeout) return;
    if (e.deltaY > 30) {
        swipe('next');
    } else if (e.deltaY < -30) {
        swipe('prev');
    }
    wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
    }, 500);
});

// Перший запуск
renderStack();