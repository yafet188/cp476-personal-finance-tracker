// categories.js
// Handles Categories page: add / rename / delete.

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('pet_token');
  if (!token) return window.location.href = 'login.html';

  const AUTH_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const newCategoryInput = document.querySelector('#newCategoryInput');
  const addCategoryBtn = document.querySelector('#addCategoryBtn');
  const catError = document.querySelector('#catError');
  const catGrid = document.querySelector('#catGrid');
  const emptyState = document.querySelector('#emptyState');
  const countText = document.querySelector('#countText');

  let allCategories = [];

  function showError(msg) {
    catError.style.display = 'block';
    catError.textContent = msg;
  }

  function hideError() {
    catError.style.display = 'none';
    catError.textContent = '';
  }

  function normalizeName(name) {
    return String(name || '').trim().replace(/\s+/g, ' ');
  }

  async function fetchCategories() {
    try {
      const res = await fetch('http://localhost:3000/api/categories', { headers: AUTH_HEADERS });
      const payload = await res.json();
      allCategories = (payload.data || []).map(item => ({
        id: item.id,
        name: String(item.name || '').trim(),
        type: String(item.type || '').trim()
      }));
      render();
    } catch (err) {
      console.error(err);
      showError('Could not load categories.');
    }
  }

  function render() {
    catGrid.innerHTML = '';
    countText.textContent = `${allCategories.length} categor${allCategories.length === 1 ? 'y' : 'ies'}`;

    if (allCategories.length === 0) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    for (const cat of allCategories) {
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
      renameBtn.addEventListener('click', async () => {
        hideError();
        const proposed = window.prompt('Rename category:', cat.name);
        if (proposed == null) return;
        const newName = normalizeName(proposed);
        if (!newName) { showError('Category name is required.'); return; }
        try {
          const res = await fetch(`http://localhost:3000/api/categories/${cat.id}`, {
            method: 'PUT',
            headers: AUTH_HEADERS,
            body: JSON.stringify({ name: newName })
          });
          const payload = await res.json();
          if (!payload.success) throw new Error(payload.message);
          await fetchCategories();
        } catch (err) {
          console.error(err);
          showError(err.message || 'Could not rename category.');
        }
      });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'linkBtn';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', async () => {
        hideError();
        if (!window.confirm(`Delete "${cat.name}"?`)) return;
        try {
          const res = await fetch(`http://localhost:3000/api/categories/${cat.id}`, {
            method: 'DELETE',
            headers: AUTH_HEADERS
          });
          const payload = await res.json();
          if (!payload.success) throw new Error(payload.message);
          await fetchCategories();
        } catch (err) {
          console.error(err);
          showError(err.message || 'Could not delete category.');
        }
      });

      actions.appendChild(renameBtn);
      actions.appendChild(delBtn);
      wrap.appendChild(left);
      wrap.appendChild(actions);
      catGrid.appendChild(wrap);
    }
  }

  addCategoryBtn.addEventListener('click', async () => {
    hideError();
    const name = normalizeName(newCategoryInput.value);
    if (!name) { showError('Category name is required.'); return; }
    try {
      const res = await fetch('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: AUTH_HEADERS,
        body: JSON.stringify({ name })
      });
      const payload = await res.json();
      if (!payload.success) throw new Error(payload.message);
      newCategoryInput.value = '';
      await fetchCategories();
    } catch (err) {
      console.error(err);
      showError(err.message || 'Could not add category.');
    }
  });

  newCategoryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addCategoryBtn.click(); }
  });

  fetchCategories();
});
