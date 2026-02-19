// ========== ТЕКСТОВЫЙ БЛОК ==========
window.renderTextBlock = function(container, block) {
  const textarea = document.createElement('textarea');
  textarea.className = 'glass-textarea';
  textarea.placeholder = 'Введите текст...';
  textarea.value = block.content || '';
  
  textarea.addEventListener('input', function() {
    block.content = this.value;
  });
  
  container.appendChild(textarea);
};

// ========== БЛОК ИЗОБРАЖЕНИЯ ==========
window.renderImageBlock = function(container, block) {
  const uploadArea = document.createElement('div');
  uploadArea.className = 'upload-area';
  uploadArea.style.padding = '24px';
  uploadArea.textContent = '+ Нажми для загрузки изображения';
  
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.hidden = true;
  
  const img = document.createElement('img');
  img.className = 'preview-image';
  img.style.display = 'none';
  
  if (block.content) {
    img.src = block.content;
    img.style.display = 'block';
    uploadArea.style.display = 'none';
  }

  uploadArea.addEventListener('click', () => fileInput.click());
  
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        window.showNotification('❌ Можно загружать только изображения', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(ev) {
        img.src = ev.target.result;
        img.style.display = 'block';
        uploadArea.style.display = 'none';
        block.content = ev.target.result;
        window.showNotification('🖼️ Изображение загружено', 'success');
      };
      reader.readAsDataURL(file);
    }
  });

  container.appendChild(uploadArea);
  container.appendChild(fileInput);
  container.appendChild(img);
};

// ========== БЛОК КАРУСЕЛИ ==========
window.renderCarouselBlock = function(container, block) {
  if (!block.content) block.content = [];
  
  const uploadArea = document.createElement('div');
  uploadArea.className = 'upload-area';
  uploadArea.style.padding = '16px';
  uploadArea.textContent = '+ Добавить фото в карусель';
  
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.hidden = true;
  fileInput.multiple = true;
  
  uploadArea.addEventListener('click', () => fileInput.click());
  
  fileInput.addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    let loaded = 0;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(ev) {
        block.content.push(ev.target.result);
        loaded++;
        if (loaded === files.length) {
          window.renderBlocks();
          window.showNotification(`🎠 Добавлено ${loaded} фото`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  });

  container.appendChild(uploadArea);
  container.appendChild(fileInput);

  if (block.content.length > 0) {
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 16px;
    `;
    
    block.content.forEach((imgSrc, idx) => {
      const item = document.createElement('div');
      item.style.cssText = `
        position: relative;
        width: 100px;
        height: 70px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--glass-border);
      `;
      item.innerHTML = `
        <img src="${imgSrc}" style="width:100%; height:100%; object-fit:cover;">
        <span class="carousel-remove" data-index="${idx}" style="
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0,0,0,0.6);
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
        ">✕</span>
      `;
      grid.appendChild(item);
    });
    
    container.appendChild(grid);
    
    // Обработчики удаления
    setTimeout(() => {
      document.querySelectorAll('.carousel-remove').forEach(btn => {
        btn.addEventListener('click', function() {
          const index = this.dataset.index;
          block.content.splice(index, 1);
          window.renderBlocks();
          window.showNotification('🗑️ Фото удалено', 'success');
        });
      });
    }, 100);
  }
};

// ========== БЛОК ВИДЕО ==========
window.renderVideoBlock = function(container, block) {
  const uploadArea = document.createElement('div');
  uploadArea.className = 'upload-area';
  uploadArea.style.padding = '24px';
  uploadArea.innerHTML = '🎬 + Загрузить видео (MP4, WebM)';
  
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'video/mp4,video/webm';
  fileInput.hidden = true;
  
  const videoContainer = document.createElement('div');
  videoContainer.style.display = 'none';
  
  const video = document.createElement('video');
  video.controls = true;
  video.style.width = '100%';
  video.style.borderRadius = 'var(--radius-md)';
  
  uploadArea.addEventListener('click', () => fileInput.click());
  
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        window.showNotification('❌ Видео слишком большое (макс 100 MB)', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(ev) {
        video.src = ev.target.result;
        videoContainer.style.display = 'block';
        uploadArea.style.display = 'none';
        block.content = ev.target.result;
        window.showNotification('🎬 Видео загружено', 'success');
      };
      reader.readAsDataURL(file);
    }
  });

  videoContainer.appendChild(video);
  container.appendChild(uploadArea);
  container.appendChild(fileInput);
  container.appendChild(videoContainer);
};

// ========== БЛОК ЦИТАТЫ ==========
window.renderQuoteBlock = function(container, block) {
  if (!block.content) block.content = { text: '', author: '' };
  
  const textarea = document.createElement('textarea');
  textarea.className = 'glass-textarea';
  textarea.placeholder = 'Текст цитаты...';
  textarea.value = block.content.text || '';
  textarea.style.marginBottom = '12px';
  
  const authorInput = document.createElement('input');
  authorInput.type = 'text';
  authorInput.className = 'glass-input';
  authorInput.placeholder = 'Автор';
  authorInput.value = block.content.author || '';
  
  textarea.addEventListener('input', function() {
    block.content.text = this.value;
  });
  
  authorInput.addEventListener('input', function() {
    block.content.author = this.value;
  });
  
  container.appendChild(textarea);
  container.appendChild(authorInput);
};

// ========== БЛОК КОДА ==========
window.renderCodeBlock = function(container, block) {
  if (!block.content) block.content = { code: '', language: 'javascript' };
  
  const select = document.createElement('select');
  select.className = 'glass-input';
  select.style.marginBottom = '12px';
  select.style.width = 'auto';
  
  const languages = ['javascript', 'python', 'html', 'css', 'java', 'cpp', 'php', 'ruby', 'sql', 'bash'];
  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang;
    if (lang === block.content.language) option.selected = true;
    select.appendChild(option);
  });
  
  select.addEventListener('change', function() {
    block.content.language = this.value;
  });
  
  const textarea = document.createElement('textarea');
  textarea.className = 'glass-textarea';
  textarea.placeholder = 'Введите код...';
  textarea.value = block.content.code || '';
  textarea.style.fontFamily = 'monospace';
  
  textarea.addEventListener('input', function() {
    block.content.code = this.value;
  });
  
  container.appendChild(select);
  container.appendChild(textarea);
};

// ========== БЛОК СПИСКА ==========
window.renderListBlock = function(container, block) {
  if (!block.content) block.content = { type: 'ul', items: ['Пункт 1', 'Пункт 2'] };
  
  const typeSelector = document.createElement('div');
  typeSelector.style.cssText = `
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  `;
  
  const ulBtn = document.createElement('button');
  ulBtn.className = `secondary-button ${block.content.type === 'ul' ? 'active' : ''}`;
  ulBtn.textContent = '• Маркированный';
  
  const olBtn = document.createElement('button');
  olBtn.className = `secondary-button ${block.content.type === 'ol' ? 'active' : ''}`;
  olBtn.textContent = '1. Нумерованный';
  
  ulBtn.addEventListener('click', function() {
    block.content.type = 'ul';
    ulBtn.classList.add('active');
    olBtn.classList.remove('active');
    renderItems();
  });
  
  olBtn.addEventListener('click', function() {
    block.content.type = 'ol';
    olBtn.classList.add('active');
    ulBtn.classList.remove('active');
    renderItems();
  });
  
  typeSelector.appendChild(ulBtn);
  typeSelector.appendChild(olBtn);
  container.appendChild(typeSelector);
  
  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'list-items';
  
  function renderItems() {
    itemsContainer.innerHTML = '';
    
    block.content.items.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.style.cssText = `
        display: flex;
        gap: 12px;
        margin-bottom: 8px;
        align-items: center;
      `;
      
      const bullet = document.createElement('span');
      bullet.style.color = 'var(--text-secondary)';
      bullet.style.minWidth = '24px';
      bullet.textContent = block.content.type === 'ul' ? '•' : `${index + 1}.`;
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'glass-input';
      input.style.flex = '1';
      input.value = item;
      input.placeholder = `Пункт ${index + 1}`;
      
      input.addEventListener('input', function() {
        block.content.items[index] = this.value;
      });
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'secondary-button';
      removeBtn.style.padding = '8px 12px';
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', function() {
        block.content.items.splice(index, 1);
        renderItems();
      });
      
      itemDiv.appendChild(bullet);
      itemDiv.appendChild(input);
      itemDiv.appendChild(removeBtn);
      itemsContainer.appendChild(itemDiv);
    });
    
    const addBtn = document.createElement('button');
    addBtn.className = 'secondary-button';
    addBtn.style.width = '100%';
    addBtn.style.marginTop = '12px';
    addBtn.textContent = '+ Добавить пункт';
    addBtn.addEventListener('click', function() {
      block.content.items.push('');
      renderItems();
    });
    
    itemsContainer.appendChild(addBtn);
  }
  
  renderItems();
  container.appendChild(itemsContainer);
};

// ========== РЕДАКТОР ТАБЛИЦЫ ==========
window.renderTableEditor = function(container, block) {
  if (!block.content) {
    block.content = {
      rows: 2,
      cols: 3,
      data: [
        ['Заголовок 1', 'Заголовок 2', 'Заголовок 3'],
        ['Ячейка 1', 'Ячейка 2', 'Ячейка 3']
      ]
    };
  }

  const controls = document.createElement('div');
  controls.style.cssText = `
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  `;

  const addRowBtn = document.createElement('button');
  addRowBtn.className = 'secondary-button';
  addRowBtn.textContent = '➕ Добавить строку';
  
  const addColBtn = document.createElement('button');
  addColBtn.className = 'secondary-button';
  addColBtn.textContent = '➕ Добавить столбец';
  
  const removeRowBtn = document.createElement('button');
  removeRowBtn.className = 'secondary-button';
  removeRowBtn.textContent = '➖ Удалить строку';
  
  const removeColBtn = document.createElement('button');
  removeColBtn.className = 'secondary-button';
  removeColBtn.textContent = '➖ Удалить столбец';

  controls.appendChild(addRowBtn);
  controls.appendChild(removeRowBtn);
  controls.appendChild(addColBtn);
  controls.appendChild(removeColBtn);
  container.appendChild(controls);

  const tableContainer = document.createElement('div');
  tableContainer.style.overflowX = 'auto';
  
  function renderTable() {
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      background: var(--bg-secondary);
      border-radius: var(--radius-sm);
      overflow: hidden;
    `;
    
    for (let i = 0; i < block.content.rows; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < block.content.cols; j++) {
        const cell = document.createElement(i === 0 ? 'th' : 'td');
        cell.style.cssText = `
          padding: 12px;
          border: 1px solid var(--glass-border);
          text-align: left;
        `;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'glass-input';
        input.style.padding = '6px 10px';
        input.style.background = 'var(--bg-tertiary)';
        input.value = block.content.data[i]?.[j] || '';
        input.placeholder = i === 0 ? `Заголовок ${j+1}` : `Ячейка ${i},${j}`;
        
        input.addEventListener('input', function() {
          if (!block.content.data[i]) block.content.data[i] = [];
          block.content.data[i][j] = this.value;
        });
        
        cell.appendChild(input);
        tr.appendChild(cell);
      }
      table.appendChild(tr);
    }
    
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
  }

  addRowBtn.addEventListener('click', function() {
    if (block.content.rows < 100) {
      block.content.rows++;
      block.content.data.push(Array(block.content.cols).fill(''));
      renderTable();
    }
  });

  removeRowBtn.addEventListener('click', function() {
    if (block.content.rows > 1) {
      block.content.rows--;
      block.content.data.pop();
      renderTable();
    }
  });

  addColBtn.addEventListener('click', function() {
    if (block.content.cols < 5) {
      block.content.cols++;
      block.content.data.forEach(row => row.push(''));
      renderTable();
    }
  });

  removeColBtn.addEventListener('click', function() {
    if (block.content.cols > 1) {
      block.content.cols--;
      block.content.data.forEach(row => row.pop());
      renderTable();
    }
  });

  renderTable();
  container.appendChild(tableContainer);
};