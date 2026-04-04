// categories.js
// Handles Categories page: add / rename / delete / reset defaults.

document.addEventListener('DOMContentLoaded', () => {
  const newCategoryInput = document.querySelector('#newCategoryInput');
  const addCategoryBtn = document.querySelector('#addCategoryBtn');
  const resetDefaultsBtn = document.querySelector('#resetDefaultsBtn');
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

  function fetchCategories(callback) {
    fetch('http://localhost:3000/api/categories')
      .then(function(res) {
        if (!res.ok) {
          throw new Error('Failed to load categories');
        }
        return res.json();
      })
      .then(function(payload) {
        const list = Array.isArray(payload.data) ? payload.data : [];

        allCategories = list.map(function(item) {
          return {
            id: item.id,
            name: String(item.name || '').trim(),
            type: String(item.type || '').trim()
          };
        });

        if (callback) {
          callback();
        }
      })
      .catch(function(err) {
        console.error(err);
        showError('Could not load categories.');
      });
  }

  function getCategories() {
    return allCategories;
  }

  function normalizeName(name) {
    return String(name || '').trim().replace(/\s+/g, ' ');
  }


  function render() {
    const categories = getCategories();
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
        hideError();

        const proposed = window.prompt('Rename category:', cat.name);
        if (proposed == null) return;

        const newName = normalizeName(proposed);
        if (!newName) {
          showError('Category name is required.');
          return;
        }

        fetch('http://localhost:3000/api/categories/' + encodeURIComponent(cat.id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: newName })
        })
          .then(function(res) {
            return res.json().then(function(data) {
              return { ok: res.ok, data: data };
            });
          })
          .then(function(result) {
            if (!result.ok) {
              throw new Error(result.data.message || 'Could not rename category.');
            }

            fetchCategories(function() {
              render();
            });
          })
          .catch(function(err) {
            console.error(err);
            showError(err.message || 'Could not rename category.');
          });
      });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'linkBtn';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        hideError();

        const ok = window.confirm(`Delete "${cat.name}"?`);
        if (!ok) return;

        fetch('http://localhost:3000/api/categories/' + encodeURIComponent(cat.id), {
          method: 'DELETE'
        })
          .then(function(res) {
            return res.json().then(function(data) {
              return { ok: res.ok, data: data };
            });
          })
          .then(function(result) {
            if (!result.ok) {
              throw new Error(result.data.message || 'Could not delete category.');
            }

            fetchCategories(function() {
              render();
            });
          })
          .catch(function(err) {
            console.error(err);
            showError(err.message || 'Could not delete category.');
          });
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

    const name = normalizeName(newCategoryInput.value);

    if (!name) {
      showError('Category name is required.');
      return;
    }

    fetch('http://localhost:3000/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name })
    })
      .then(function(res) {
        return res.json().then(function(data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function(result) {
        if (!result.ok) {
          throw new Error(result.data.message || 'Could not add category.');
        }

        newCategoryInput.value = '';
        fetchCategories(function() {
          render();
        });
      })
      .catch(function(err) {
        console.error(err);
        showError(err.message || 'Could not add category.');
      });
  });

  resetDefaultsBtn.addEventListener('click', function() {
    hideError();

    const ok = window.confirm('Reset categories to defaults? Unused custom categories will be removed.');
    if (!ok) return;

    fetch('http://localhost:3000/api/categories/reset-defaults', {
      method: 'POST'
    })
      .then(function(res) {
        return res.json().then(function(data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function(result) {
        if (!result.ok) {
          throw new Error(result.data.message || 'Could not reset categories.');
        }

        fetchCategories(function() {
          render();
        });
      })
      .catch(function(err) {
        console.error(err);
        showError(err.message || 'Could not reset categories.');
      });
  });

  newCategoryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategoryBtn.click();
    }
  });

  fetchCategories(function() {
    render();
  });
});