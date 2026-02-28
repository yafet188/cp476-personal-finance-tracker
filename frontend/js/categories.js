

// categories.js
// Handles Categories page: add / rename / delete / reset defaults.
// Course-safe: DOM + events + arrays/objects + localStorage.

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'pet_categories_v1';

  const DEFAULTS = [
    { id: 1, name: 'Food & Dining' },
    { id: 2, name: 'Transportation' },
    { id: 3, name: 'Entertainment' },
    { id: 4, name: 'Other' },
  ];

  const newCategoryInput = document.querySelector('#newCategoryInput');
  const addCategoryBtn = document.querySelector('#addCategoryBtn');
  const resetDefaultsBtn = document.querySelector('#resetDefaultsBtn');
  const catError = document.querySelector('#catError');
  const catGrid = document.querySelector('#catGrid');
  const emptyState = document.querySelector('#emptyState');
  const countText = document.querySelector('#countText');

  function showError(msg) {
    catError.style.display = 'block';
    catError.textContent = msg;
  }

  function hideError() {
    catError.style.display = 'none';
    catError.textContent = '';
  }

  function loadCategories() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULTS));
      return DEFAULTS.slice();
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCategories(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function normalizeName(name) {
    return String(name || '').trim().replace(/\s+/g, ' ');
  }

  function nameExists(list, name, ignoreId) {
    const target = name.toLowerCase();
    return list.some(c => (ignoreId ? c.id !== ignoreId : true) && String(c.name).toLowerCase() === target);
  }

  function nextId(list) {
    return list.length ? Math.max(...list.map(c => c.id || 0)) + 1 : 1;
  }

  function render() {
    const categories = loadCategories();
    catGrid.innerHTML = '';

    countText.textContent = `${categories.length} categor${categories.length === 1 ? 'y' : 'ies'}`;

    if (categories.length === 0) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    for (const cat of categories) {
      const wrap = document.createElement('div');
      wrap.className = 'catItem';

      const left = document.createElement('div');

      const name = document.createElement('div');
      name.className = 'catName';
      name.textContent = cat.name;

      const meta = document.createElement('div');
      meta.className = 'catMeta';
      meta.textContent = `ID: ${cat.id}`;

      left.appendChild(name);
      left.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'catActions';

      const renameBtn = document.createElement('button');
      renameBtn.type = 'button';
      renameBtn.className = 'linkBtn';
      renameBtn.textContent = 'Rename';
      renameBtn.addEventListener('click', () => {
        const proposed = window.prompt('Rename category:', cat.name);
        if (proposed == null) return;

        const newName = normalizeName(proposed);
        if (!newName) {
          alert('Name cannot be empty.');
          return;
        }

        const list = loadCategories();
        if (nameExists(list, newName, cat.id)) {
          alert('That category already exists.');
          return;
        }

        const item = list.find(c => c.id === cat.id);
        if (!item) return;

        item.name = newName;
        saveCategories(list);
        render();
      });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'linkBtn';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        const ok = window.confirm(`Delete "${cat.name}"?`);
        if (!ok) return;

        const list = loadCategories().filter(c => c.id !== cat.id);
        saveCategories(list);
        render();
      });

      actions.appendChild(renameBtn);
      actions.appendChild(delBtn);

      wrap.appendChild(left);
      wrap.appendChild(actions);

      catGrid.appendChild(wrap);
    }
  }

  addCategoryBtn.addEventListener('click', () => {
    hideError();

    const raw = newCategoryInput.value;
    const name = normalizeName(raw);

    if (!name) {
      showError('Category name is required.');
      return;
    }

    const list = loadCategories();
    if (nameExists(list, name)) {
      showError('That category already exists.');
      return;
    }

    list.push({ id: nextId(list), name });
    saveCategories(list);
    newCategoryInput.value = '';
    render();
  });

  resetDefaultsBtn.addEventListener('click', () => {
    hideError();

    const ok = window.confirm('Reset categories to default? This will replace your custom list.');
    if (!ok) return;

    saveCategories(DEFAULTS.slice());
    newCategoryInput.value = '';
    render();
  });

  newCategoryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategoryBtn.click();
    }
  });

  render();
});