```javascript
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const addSnippetButton = document.getElementById('addSnippet');
    const snippetList = document.getElementById('snippetList');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close');
    const snippetTitleInput = document.getElementById('snippetTitle');
    const snippetDescriptionInput = document.getElementById('snippetDescription');
    const snippetCodeInput = document.getElementById('snippetCode');
    const snippetLanguageSelect = document.getElementById('snippetLanguage');
    const saveSnippetButton = document.getElementById('saveSnippet');

    let snippets = JSON.parse(localStorage.getItem('snippets')) || [];
    let editingSnippetId = null;

    function renderSnippets() {
        snippetList.innerHTML = '';
        snippets.forEach((snippet, index) => {
            const snippetDiv = document.createElement('div');
            snippetDiv.classList.add('snippet');
            snippetDiv.innerHTML = `
                <h3>${snippet.title}</h3>
                <p>${snippet.description}</p>
                <pre><code class="language-${snippet.language}">${snippet.code}</code></pre>
                <div class="actions">
                    <button class="edit" data-id="${index}">Edit</button>
                    <button class="delete" data-id="${index}">Delete</button>
                </div>
            `;
            snippetList.appendChild(snippetDiv);
            Prism.highlightAll(); // Ensure syntax highlighting after rendering
        });
    }

    function saveSnippets() {
        localStorage.setItem('snippets', JSON.stringify(snippets));
    }

    function openModal() {
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
        snippetTitleInput.value = '';
        snippetDescriptionInput.value = '';
        snippetCodeInput.value = '';
        editingSnippetId = null;
    }

    addSnippetButton.addEventListener('click', () => {
        openModal();
    });

    closeButton.addEventListener('click', () => {
        closeModal();
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    saveSnippetButton.addEventListener('click', () => {
        const title = snippetTitleInput.value;
        const description = snippetDescriptionInput.value;
        const code = snippetCodeInput.value;
        const language = snippetLanguageSelect.value;

        if (title && code) {
            if (editingSnippetId !== null) {
                // Update existing snippet
                snippets[editingSnippetId] = { title, description, code, language };
            } else {
                // Add new snippet
                snippets.push({ title, description, code, language });
            }

            saveSnippets();
            renderSnippets();
            closeModal();
        } else {
            alert('Title and Code are required!');
        }
    });

    snippetList.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit')) {
            const id = parseInt(event.target.dataset.id);
            const snippet = snippets[id];
            snippetTitleInput.value = snippet.title;
            snippetDescriptionInput.value = snippet.description;
            snippetCodeInput.value = snippet.code;
            snippetLanguageSelect.value = snippet.language;
            editingSnippetId = id;
            openModal();
        }

        if (event.target.classList.contains('delete')) {
            const id = parseInt(event.target.dataset.id);
            if (confirm('Are you sure you want to delete this snippet?')) {
                snippets.splice(id, 1);
                saveSnippets();
                renderSnippets();
            }
        }
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredSnippets = snippets.filter(snippet => {
            return (
                snippet.title.toLowerCase().includes(searchTerm) ||
                snippet.description.toLowerCase().includes(searchTerm) ||
                snippet.code.toLowerCase().includes(searchTerm)
            );
        });

        snippetList.innerHTML = '';
        filteredSnippets.forEach((snippet, index) => {
            const snippetDiv = document.createElement('div');
            snippetDiv.classList.add('snippet');
            snippetDiv.innerHTML = `
                <h3>${snippet.title}</h3>
                <p>${snippet.description}</p>
                <pre><code class="language-${snippet.language}">${snippet.code}</code></pre>
                <div class="actions">
                    <button class="edit" data-id="${snippets.indexOf(snippet)}">Edit</button>
                    <button class="delete" data-id="${snippets.indexOf(snippet)}">Delete</button>
                </div>
            `;
            snippetList.appendChild(snippetDiv);
			Prism.highlightAll();
        });
    });

    renderSnippets();
});