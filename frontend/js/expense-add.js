document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('pet_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const form = document.querySelector('form');
    const amountInput = document.getElementById('amountInput');
    const dateInput = document.getElementById('dateInput');
    const categoryInput = document.getElementById('categoryInput');
    const noteInput = document.getElementById('noteInput');
    const formError = document.getElementById('formError');


    try {
        const catRes = await fetch('http://localhost:3000/api/categories', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const catData = await catRes.json();

        if (catData.status === 'ok' || catData.data) {
            categoryInput.innerHTML = '<option value="">Select category</option>';

            // Add real categories from the database
            const categories = catData.data || catData;
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                categoryInput.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to load categories', error);
    }

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formError.style.display = 'none';

        const payload = {
            amount: parseFloat(amountInput.value),
            date: dateInput.value,
            category_id: parseInt(categoryInput.value),
            note: noteInput.value
        };

        try {
            const response = await fetch('http://localhost:3000/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                window.location.href = 'expenses.html';
            } else {
                formError.textContent = result.message || 'Failed to add expense.';
                formError.style.display = 'block';
            }
        } catch (err) {
            console.error(err);
            formError.textContent = 'Server error.';
            formError.style.display = 'block';
        }
    });
});