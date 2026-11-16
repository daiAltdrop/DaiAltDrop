const sourceCards = [...document.querySelectorAll("[data-source-item]")];
const targetCards = [...document.querySelectorAll("[data-target-item]")];
const consolePanel = document.querySelector(".upgrade-console");
const upgradeButton = document.querySelector("#upgrade-button");
const statusMessage = document.querySelector("#upgrade-status");
const spinModeButton = document.querySelector("#spin-mode-button");

let selectedSource = null;
let selectedTarget = null;
let isUpgrading = false;
let spinDuration = 1000;

function updateSpinModeButton() {
    const isLongSpin = spinDuration === 3000;
    spinModeButton.setAttribute("aria-pressed", String(isLongSpin));
    spinModeButton.innerHTML = isLongSpin
        ? '<i class="fa-solid fa-forward-step"></i> Довгий прокрут · 3 с'
        : '<i class="fa-solid fa-forward"></i> Швидкий прокрут · 1 с';
}

function formatPoints(value) {
    return `${Number(value).toLocaleString("uk-UA")} балів`;
}

function updateSelection(card, type) {
    const isSource = type === "source";
    const cards = isSource ? sourceCards : targetCards;
    const current = isSource ? selectedSource : selectedTarget;
    const selected = current === card ? null : card;

    cards.forEach((item) => {
        item.setAttribute("aria-pressed", String(item === selected));
    });

    if (isSource) {
        selectedSource = selected;
        targetCards.forEach((item) => {
            item.disabled = Boolean(selected && Number(item.dataset.price) <= Number(selected.dataset.price));
        });

        if (selectedTarget && selectedTarget.disabled) {
            selectedTarget = null;
            targetCards.forEach((item) => item.setAttribute("aria-pressed", "false"));
        }
    } else {
        selectedTarget = selected;
    }

    setStatus("Демо-режим — без реальних предметів і балів.");
    updatePreview();
}

function updatePreview() {
    const sourceName = document.querySelector("#source-name");
    const sourcePrice = document.querySelector("#source-value");
    const sourceArt = document.querySelector("#source-art");
    const targetName = document.querySelector("#target-name");
    const targetPrice = document.querySelector("#target-value");
    const targetArt = document.querySelector("#target-art");
    const chanceValue = document.querySelector("#chance-value");
    const chanceRing = document.querySelector("#chance-ring");
    const chanceMeterFill = document.querySelector("#chance-meter-fill");
    const chanceDetail = document.querySelector("#chance-detail");
    const chanceNote = document.querySelector("#chance-note");

    sourceName.textContent = selectedSource ? selectedSource.dataset.name : "Обери предмет";
    sourcePrice.textContent = selectedSource ? formatPoints(selectedSource.dataset.price) : "— балів";
    sourceArt.innerHTML = selectedSource
        ? selectedSource.querySelector(".item-art").innerHTML
        : '<i class="fa-solid fa-box-open"></i>';

    targetName.textContent = selectedTarget ? selectedTarget.dataset.name : "Обери ціль";
    targetPrice.textContent = selectedTarget ? formatPoints(selectedTarget.dataset.price) : "— балів";
    targetArt.innerHTML = selectedTarget
        ? selectedTarget.querySelector(".item-art").innerHTML
        : '<i class="fa-solid fa-gem"></i>';

    const chance = selectedSource && selectedTarget
        ? Math.floor((Number(selectedSource.dataset.price) / Number(selectedTarget.dataset.price)) * 100)
        : 0;

    chanceValue.textContent = selectedSource && selectedTarget ? `${chance}%` : "—%";
    chanceRing.style.setProperty("--chance", `${chance}%`);
    chanceMeterFill.style.setProperty("--chance", `${chance}%`);
    chanceDetail.textContent = selectedSource && selectedTarget
        ? `${Number(selectedSource.dataset.price).toLocaleString("uk-UA")} → ${Number(selectedTarget.dataset.price).toLocaleString("uk-UA")} балів`
        : "Шанс з’явиться після вибору";
    chanceNote.textContent = selectedSource && selectedTarget
        ? "Шанс розраховано за вартістю предметів"
        : "Обери два предмети";
    upgradeButton.disabled = !(selectedSource && selectedTarget) || isUpgrading;
}

function setStatus(message, result) {
    statusMessage.textContent = message;
    statusMessage.classList.toggle("is-success", result === "success");
    statusMessage.classList.toggle("is-failure", result === "failure");
}

async function runUpgrade() {
    if (!selectedSource || !selectedTarget || isUpgrading) {
        return;
    }

    const chance = Math.floor((Number(selectedSource.dataset.price) / Number(selectedTarget.dataset.price)) * 100);
    const resultRoll = Math.random() * 360;
    const resultAngle = resultRoll || 0.001;
    isUpgrading = true;
    upgradeButton.disabled = true;
    spinModeButton.disabled = true;
    const turns = spinDuration === 3000 ? 4320 : 2160;
    const durationInSeconds = spinDuration / 1000;
    const chanceRing = document.querySelector("#chance-ring");
    const spinPointer = document.querySelector(".spin-pointer");
    chanceRing.style.setProperty("--spin-duration", `${durationInSeconds}s`);
    chanceRing.style.setProperty("--spin-rotation", `${turns + resultAngle}deg`);
    consolePanel.classList.remove("is-spinning");
    void consolePanel.offsetWidth;
    [...sourceCards, ...targetCards].forEach((card) => {
        card.disabled = true;
    });
    consolePanel.classList.add("is-spinning");
    setStatus(`Прокрутка триває ${durationInSeconds} с…`);

    await new Promise((resolve) => window.setTimeout(resolve, spinDuration + 50));

    const successZoneDegrees = chance * 3.6;
    const stoppedAngle = resultAngle % 360;
    const succeeded = stoppedAngle < successZoneDegrees;
    if (succeeded) {
        setStatus(`Демо-апгрейд успішний: ${selectedTarget.dataset.name}! Інвентар не змінено.`, "success");
    } else {
        setStatus("Цього разу не вийшло. Це демо — предмети та бали не змінюються.", "failure");
    }

    await new Promise((resolve) => window.setTimeout(resolve, 2000));
    consolePanel.classList.remove("is-spinning");
    consolePanel.classList.add("is-resetting");
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    consolePanel.classList.remove("is-resetting");

    isUpgrading = false;
    spinModeButton.disabled = false;
    sourceCards.forEach((card) => {
        card.disabled = false;
    });
    targetCards.forEach((card) => {
        card.disabled = Boolean(selectedSource && Number(card.dataset.price) <= Number(selectedSource.dataset.price));
    });
    updatePreview();
}

sourceCards.forEach((card) => {
    card.addEventListener("click", () => updateSelection(card, "source"));
});

targetCards.forEach((card) => {
    card.addEventListener("click", () => updateSelection(card, "target"));
});

upgradeButton.addEventListener("click", runUpgrade);

spinModeButton.addEventListener("click", () => {
    if (isUpgrading) {
        return;
    }

    spinDuration = spinDuration === 1000 ? 3000 : 1000;
    updateSpinModeButton();
});

updateSpinModeButton();
