/* ── Life Dashboard — app.js ── */

// ── Storage helpers ──────────────────────────────────────────────
const store = {
  get: (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val))
};

// ── Clock & Greeting ─────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('time').textContent = `${h}:${m}:${s}`;

  document.getElementById('date').textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const hour = now.getHours();
  const name = store.get('userName', '');
  const salutation = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent = name
    ? `${salutation}, ${name} 👋`
    : `${salutation} 👋`;
}
setInterval(updateClock, 1000);
updateClock();

// ── Custom Name ──────────────────────────────────────────────────
const nameModal  = document.getElementById('name-modal');
const nameInput  = document.getElementById('name-input');

document.getElementById('name-btn').addEventListener('click', () => {
  nameInput.value = store.get('userName', '');
  nameModal.classList.remove('hidden');
  nameInput.focus();
});

document.getElementById('name-save').addEventListener('click', () => {
  const val = nameInput.value.trim();
  store.set('userName', val);
  nameModal.classList.add('hidden');
  updateClock();
});

document.getElementById('name-cancel').addEventListener('click', () => {
  nameModal.classList.add('hidden');
});

nameModal.addEventListener('click', (e) => {
  if (e.target === nameModal) nameModal.classList.add('hidden');
});

// ── Theme Toggle ─────────────────────────────────────────────────
const themeBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

applyTheme(store.get('theme', 'light'));

themeBtn.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  store.set('theme', next);
  applyTheme(next);
});

// ── Focus Timer ──────────────────────────────────────────────────
let timerDuration = store.get('timerDuration', 25) * 60; // seconds
let timerRemaining = timerDuration;
let timerInterval = null;
let timerRunning = false;

const timerDisplay = document.getElementById('timer-display');
const timerMinutesInput = document.getElementById('timer-minutes');
timerMinutesInput.value = store.get('timerDuration', 25);

function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timerRemaining);
}

function setTimerState(state) {
  timerDisplay.classList.remove('running', 'finished');
  if (state) timerDisplay.classList.add(state);
}

document.getElementById('timer-start').addEventListener('click', () => {
  if (timerRunning) return;
  timerRunning = true;
  setTimerState('running');
  timerInterval = setInterval(() => {
    timerRemaining--;
    renderTimer();
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      setTimerState('finished');
      timerDisplay.textContent = '00:00';
      // Simple audio beep via Web Audio API
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        osc.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch (_) {}
    }
  }, 1000);
});

document.getElementById('timer-stop').addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning = false;
  setTimerState(null);
});

document.getElementById('timer-reset').addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning = false;
  timerRemaining = timerDuration;
  setTimerState(null);
  renderTimer();
});

document.getElementById('timer-set').addEventListener('click', () => {
  const mins = parseInt(timerMinutesInput.value, 10);
  if (!mins || mins < 1 || mins > 120) return;
  clearInterval(timerInterval);
  timerRunning = false;
  timerDuration = mins * 60;
  timerRemaining = timerDuration;
  store.set('timerDuration', mins);
  setTimerState(null);
  renderTimer();
});

renderTimer();

// ── To-Do List ───────────────────────────────────────────────────
let todos = store.get('todos', []);

function saveTodos() { store.set('todos', todos); }

function getSortedTodos() {
  const sort = document.getElementById('todo-sort').value;
  const copy = [...todos];
  if (sort === 'az') copy.sort((a, b) => a.text.localeCompare(b.text));
  else if (sort === 'za') copy.sort((a, b) => b.text.localeCompare(a.text));
  else if (sort === 'done') copy.sort((a, b) => Number(a.done) - Number(b.done));
  return copy;
}

function renderTodos() {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  getSortedTodos().forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.done ? ' done' : ''}`;
    li.dataset.id = todo.id;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = todo.done;
    cb.addEventListener('change', () => toggleTodo(todo.id));

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    span.contentEditable = 'true';
    span.setAttribute('role', 'textbox');
    span.setAttribute('aria-label', 'Edit task');
    span.addEventListener('blur', () => {
      const newText = span.textContent.trim();
      if (!newText) { span.textContent = todo.text; return; }
      // Duplicate check on edit
      const isDup = todos.some(t => t.id !== todo.id && t.text.toLowerCase() === newText.toLowerCase());
      if (isDup) { alert('A task with that name already exists.'); span.textContent = todo.text; return; }
      todo.text = newText;
      saveTodos();
    });
    span.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); span.blur(); }
    });

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-small';
    delBtn.textContent = '🗑️';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.addEventListener('click', () => deleteTodo(todo.id));

    actions.appendChild(delBtn);
    li.append(cb, span, actions);
    list.appendChild(li);
  });
}

function addTodo() {
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  if (!text) return;

  // Prevent duplicates
  const isDuplicate = todos.some(t => t.text.toLowerCase() === text.toLowerCase());
  if (isDuplicate) { alert('That task already exists.'); return; }

  todos.push({ id: Date.now(), text, done: false });
  saveTodos();
  renderTodos();
  input.value = '';
  input.focus();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) { todo.done = !todo.done; saveTodos(); renderTodos(); }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

document.getElementById('todo-add').addEventListener('click', addTodo);
document.getElementById('todo-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});
document.getElementById('todo-sort').addEventListener('change', renderTodos);

renderTodos();

// ── Quick Links ──────────────────────────────────────────────────
let links = store.get('links', []);

function saveLinks() { store.set('links', links); }

function renderLinks() {
  const grid = document.getElementById('links-grid');
  grid.innerHTML = '';
  links.forEach(link => {
    const chip = document.createElement('div');
    chip.className = 'link-chip';

    const anchor = document.createElement('a');
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = link.name;
    anchor.style.textDecoration = 'none';
    anchor.style.color = 'inherit';

    const del = document.createElement('button');
    del.className = 'link-chip-delete';
    del.textContent = '✕';
    del.setAttribute('aria-label', `Remove ${link.name}`);
    del.addEventListener('click', () => {
      links = links.filter(l => l.id !== link.id);
      saveLinks();
      renderLinks();
    });

    chip.append(anchor, del);
    grid.appendChild(chip);
  });
}

function addLink() {
  const nameVal = document.getElementById('link-name').value.trim();
  const urlVal  = document.getElementById('link-url').value.trim();
  if (!nameVal || !urlVal) return;

  // Basic URL validation
  try { new URL(urlVal); } catch { alert('Please enter a valid URL (include https://).'); return; }

  links.push({ id: Date.now(), name: nameVal, url: urlVal });
  saveLinks();
  renderLinks();
  document.getElementById('link-name').value = '';
  document.getElementById('link-url').value = '';
}

document.getElementById('link-add').addEventListener('click', addLink);
document.getElementById('link-url').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addLink();
});

renderLinks();
