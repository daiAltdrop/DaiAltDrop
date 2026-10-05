// Перевірка та застосування теми з localStorage при старті
try {
  const savedTheme = localStorage.getItem("leros-theme");
  if (savedTheme === "light") {
    document.documentElement.dataset.theme = "light";
  }
} catch (e) {}

const $ = s => document.querySelector(s); const $$ = s => [...document.querySelectorAll(s)];

let cur = 1;
const TOTAL = 5;

const overlay = $('#overlay');
const prog = $('#prog');
const backBtn = $('#back');  function go(n) {   const dir = n < cur;   $$('.step').forEach(s => s.classList.remove('active', 'back-dir'));
  
  const targetStep = $(`.step[data-step="${n}"]`);
  targetStep.classList.toggle('back-dir', dir);
  targetStep.classList.add('active');
  
  cur = n;
  prog.style.width = Math.min(100, ((n - 1) / TOTAL) * 100 + (n === 1 ? 8 : 0)) + '%';
  backBtn.style.visibility = (n > 1 && n < 6) ? 'visible' : 'hidden';
  
  if (n === 2) setCupid();
}

const openM = () => { overlay.classList.add('open'); go(1); };
const closeM = () => overlay.classList.remove('open');

$('#open').onclick = openM;
$('#close').onclick = closeM;
$('#done').onclick = closeM;  overlay.addEventListener('click', e => {   if (e.target === overlay) closeM(); });  document.addEventListener('keydown', e => {   if (e.key === 'Escape') closeM(); });  backBtn.onclick = () => go(cur - 1); $$('[data-go]').forEach(b => b.onclick = () => go(+b.dataset.go));

$('#google').onclick = () => {
  $('#welcome').textContent = 'Вхід через Google виконано.';
  prog.style.width = '100%';
  go(6);
};

/* Перемикання теми */
$('#theme').onclick = () => {
  const currentTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = currentTheme;
  try {
    localStorage.setItem('leros-theme', currentTheme);
  } catch (e) {}
};

/* Крок 2: Купідон та валідація */
const pass = $('#pass');
const email = $('#email');
const cupid = $('#cupid');

function setCupid() {
  const shown = pass.type === 'text';
  cupid.classList.toggle('hide', !shown);
  $('#slash').style.display = shown ? 'none' : '';
  $('#eye').setAttribute('aria-label', shown ? 'Сховати пароль' : 'Показати пароль');
  
  const len = pass.value.length;
  const x = Math.max(-4, Math.min(4, -4 + len * 0.7));
  const y = 3;
  
  ['pl', 'pr'].forEach(id => {
    $('#' + id).style.transform = shown ? `translate(${x}px,${y}px)` : 'none';
  });
}

$('#eye').onclick = () => {
  pass.type = pass.type === 'password' ? 'text' : 'password';
  setCupid();
};

pass.addEventListener('input', () => {
  setCupid();
  v2();
});

email.addEventListener('input', v2);

pass.addEventListener('focus', () => {
  if (pass.type === 'password') cupid.classList.add('hide');
});

function v2() {
  const okE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value);
  const okP = pass.value.length >= 8;
  $('#err2').textContent = pass.value && !okP ? 'Пароль має містити щонайменше 8 символів' : '';
  $('#next2').disabled = !(okE && okP);
}

$('#next2').onclick = () => go(3);

/* Крок 3: Номер телефону */
const phone = $('#phone');
const code = $('#code');

phone.addEventListener('input', () => {
  const digitsCount = phone.value.replace(/\D/g, '').length;
  $('#codeBox').classList.toggle('show', digitsCount >= 10);
});

code.addEventListener('input', () => {
  code.value = code.value.replace(/\D/g, '');
  $('#next3').disabled = code.value.length < 4;
});

$('#next3').onclick = () => go(4);

/* Крок 4: Вік 14+ */
const MIN_AGE = 14;
const MONTHS = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
const today = new Date();
const max = new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate());
const mY = max.getFullYear();
const mM = max.getMonth();
const mD = max.getDate();

const dd = $('#dd');
const mm = $('#mm');
const yy = $('#yy');
const fn = $('#fn');
const ln = $('#ln');

const fill = (sel, items, ph, keep) => {
  sel.innerHTML = `<option value="">${ph}</option>` + items.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
  if (keep !== '' && items.some(([v]) => String(v) === String(keep))) {
    sel.value = keep;
  }
};

function rebuild() {
  const y = yy.value;
  const m = mm.value;
  const d = dd.value;
  const maxMonth = (y !== '' && +y === mY) ? mM : 11;
  
  fill(mm, MONTHS.slice(0, maxMonth + 1).map((n, i) => [i, n]), 'Місяць', m);
  
  const mNow = mm.value;
  let days = 31;
  if (mNow !== '') {
    days = new Date(y === '' ? 2000 : +y, +mNow + 1, 0).getDate();
  }
  if (y !== '' && +y === mY && mNow !== '' && +mNow === mM) {
    days = Math.min(days, mD);
  }
  
  fill(dd, Array.from({ length: days }, (_, i) => [i + 1, i + 1]), 'День', d);
  $('#next4').disabled = !(fn.value.trim() && ln.value.trim() && dd.value && mm.value !== '' && yy.value);
}

fill(yy, Array.from({ length: 100 }, (_, i) => [mY - i, mY - i]), 'Рік', '');
[yy, mm, dd].forEach(s => s.addEventListener('change', rebuild));
[fn, ln].forEach(i => i.addEventListener('input', rebuild));
rebuild();

$('#maxHint').textContent = `Найпізніша доступна дата: ${mD} ${MONTHS[mM].toLowerCase()} ${mY}.`;
$('#next4').onclick = () => go(5);

/* Крок 5: Верифікація документа (KYC) */
let hasFile = false;
const fin = () => $('#finish').disabled = !(hasFile && $('input[name=doc]:checked'));  $$('input[name=doc]').forEach(r => {   r.onchange = () => {$('#dropBox').classList.add('show');
    fin();
  };
});

const drop = $('#drop');
const file = $('#file');

function take(f) {
  if (!f || !f.type.startsWith('image/')) return;
  hasFile = true;
  const u = URL.createObjectURL(f);
  $('#prev').innerHTML = `<img src="${u}" alt="Фото документа">`;
  fin();
}

drop.onclick = () => file.click();
drop.onkeydown = e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    file.click();
  }
};

file.onchange = () => take(file.files[0]);

['dragenter', 'dragover'].forEach(ev => {
  drop.addEventListener(ev, e => {
    e.preventDefault();
    drop.classList.add('over');
  });
});

['dragleave', 'drop'].forEach(ev => {
  drop.addEventListener(ev, e => {
    e.preventDefault();
    drop.classList.remove('over');
  });
});

drop.addEventListener('drop', e => take(e.dataTransfer.files[0]));

$('#finish').onclick = () => {
  $('#welcome').textContent = `Дякуємо, ${fn.value.trim()}! Документ на перевірці.`;
  prog.style.width = '100%';
  go(6);
};