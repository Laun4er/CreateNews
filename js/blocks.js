// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
window.blocks = [];
window.blocksContainer = document.getElementById('blocks-container');

// ========== РЕНДЕРИНГ БЛОКОВ ==========
window.renderBlocks = function() {
  blocksContainer.innerHTML = '';
  
  blocks.forEach((block, index) => {
    const blockDiv = document.createElement('div');
    blockDiv.className = 'block-item';
    blockDiv.dataset.id = block.id;
    blockDiv.dataset.index = index;
    blockDiv.draggable = false;

    // Шапка блока
    const header = document.createElement('div');
    header.className = 'block-header';
    
    // Левая часть шапки
    const headerLeft = document.createElement('div');
    headerLeft.className = 'block-header-left';
    
    // Drag Handle
    const dragHandle = document.createElement('span');
    dragHandle.className = 'drag-handle';
    dragHandle.innerHTML = '⋮⋮';
    dragHandle.setAttribute('aria-label', 'Перетащить для изменения порядка');
    
    // Бейдж с типом блока
    const badge = document.createElement('div');
    badge.className = 'block-type-badge';
    
    let icon = '📄', typeName = 'ТЕКСТ';
    if (block.type === 'image') { icon = '🖼️'; typeName = 'ФОТО'; }
    else if (block.type === 'carousel') { icon = '🎠'; typeName = 'КАРУСЕЛЬ'; }
    else if (block.type === 'table') { icon = '📊'; typeName = 'ТАБЛИЦА'; }
    else if (block.type === 'video') { icon = '🎬'; typeName = 'ВИДЕО'; }
    else if (block.type === 'quote') { icon = '❝'; typeName = 'ЦИТАТА'; }
    else if (block.type === 'code') { icon = '{ }'; typeName = 'КОД'; }
    else if (block.type === 'list') { icon = '✓'; typeName = 'СПИСОК'; }
    
    badge.innerHTML = `
      <span class="block-type-icon">${icon}</span>
      <span class="block-type-text">${typeName}</span>
    `;
    
    // Кастомное имя блока
    const nameContainer = document.createElement('div');
    nameContainer.className = 'block-name-editor hidden';
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'glass-input';
    nameInput.style.padding = '4px 12px';
    nameInput.style.width = '150px';
    nameInput.placeholder = 'Название блока...';
    nameInput.value = block.name || '';
    
    const nameSaveBtn = document.createElement('button');
    nameSaveBtn.className = 'secondary-button';
    nameSaveBtn.style.padding = '4px 12px';
    nameSaveBtn.textContent = '✓';
    
    nameContainer.appendChild(nameInput);
    nameContainer.appendChild(nameSaveBtn);
    
    const nameDisplay = document.createElement('span');
    nameDisplay.className = 'block-name-display';
    if (block.name) {
      nameDisplay.textContent = block.name;
      nameDisplay.style.display = 'inline-block';
    } else {
      nameDisplay.style.display = 'none';
    }
    
    // Обработчики для кастомного имени
    badge.addEventListener('dblclick', function(e) {
      e.stopPropagation();
      badge.style.display = 'none';
      nameDisplay.style.display = 'none';
      nameContainer.classList.remove('hidden');
      nameInput.focus();
    });
    
    nameSaveBtn.addEventListener('click', function() {
      const newName = nameInput.value.trim();
      if (newName) {
        block.name = newName;
        nameDisplay.textContent = newName;
        nameDisplay.style.display = 'inline-block';
        window.showNotification(`📌 Блок переименован в "${newName}"`, 'success');
      } else {
        block.name = '';
        nameDisplay.style.display = 'none';
      }
      
      badge.style.display = 'flex';
      nameContainer.classList.add('hidden');
    });
    
    nameInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        nameSaveBtn.click();
      }
    });
    
    nameDisplay.addEventListener('click', function() {
      badge.style.display = 'none';
      nameDisplay.style.display = 'none';
      nameContainer.classList.remove('hidden');
      nameInput.value = block.name || '';
      nameInput.focus();
    });
    
    // Кнопка информации
    const infoBtn = document.createElement('button');
    infoBtn.className = 'block-info-btn';
    infoBtn.innerHTML = '?';
    infoBtn.setAttribute('aria-label', 'Информация о блоке');
    
    headerLeft.appendChild(dragHandle);
    headerLeft.appendChild(badge);
    headerLeft.appendChild(nameDisplay);
    headerLeft.appendChild(nameContainer);
    headerLeft.appendChild(infoBtn);
    
    // Правая часть шапки (удаление)
    const headerRight = document.createElement('div');
    headerRight.className = 'block-header-right';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'block-remove';
    removeBtn.innerHTML = '✕';
    removeBtn.setAttribute('aria-label', 'Удалить блок');
    removeBtn.dataset.id = block.id;
    
    headerRight.appendChild(removeBtn);
    
    header.appendChild(headerLeft);
    header.appendChild(headerRight);

    // Контейнер для контента
    const contentDiv = document.createElement('div');
    contentDiv.className = 'block-content';

    // Рендерим соответствующий тип блока
    if (block.type === 'text') window.renderTextBlock(contentDiv, block);
    else if (block.type === 'image') window.renderImageBlock(contentDiv, block);
    else if (block.type === 'carousel') window.renderCarouselBlock(contentDiv, block);
    else if (block.type === 'table') window.renderTableEditor(contentDiv, block);
    else if (block.type === 'video') window.renderVideoBlock(contentDiv, block);
    else if (block.type === 'quote') window.renderQuoteBlock(contentDiv, block);
    else if (block.type === 'code') window.renderCodeBlock(contentDiv, block);
    else if (block.type === 'list') window.renderListBlock(contentDiv, block);

    blockDiv.appendChild(header);
    blockDiv.appendChild(contentDiv);
    blocksContainer.appendChild(blockDiv);
  });

  // Инициализация Drag & Drop
  initDragAndDrop();
  
  // Обработчики удаления
  initRemoveHandlers();
  
  // Обработчики информации
  initInfoHandlers();
};

// ========== DRAG & DROP ==========
function initDragAndDrop() {
  const draggables = document.querySelectorAll('.block-item');
  
  draggables.forEach(draggable => {
    const dragHandle = draggable.querySelector('.drag-handle');
    
    dragHandle.addEventListener('mousedown', () => {
      draggable.draggable = true;
    });
    
    draggable.addEventListener('dragstart', function(e) {
      this.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', this.dataset.id);
    });
    
    draggable.addEventListener('dragend', function() {
      this.classList.remove('dragging');
      draggable.draggable = false;
    });
    
    draggable.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    
    draggable.addEventListener('drop', function(e) {
      e.preventDefault();
      
      const dragging = document.querySelector('.dragging');
      if (!dragging || dragging === this) return;
      
      const dragId = Number(dragging.dataset.id);
      const dropId = Number(this.dataset.id);
      
      const dragIndex = blocks.findIndex(b => b.id === dragId);
      const dropIndex = blocks.findIndex(b => b.id === dropId);
      
      if (dragIndex !== -1 && dropIndex !== -1) {
        const [removed] = blocks.splice(dragIndex, 1);
        blocks.splice(dropIndex, 0, removed);
        renderBlocks();
        window.showNotification('🔄 Порядок блоков изменён', 'success');
      }
    });
  });
}

// ========== УДАЛЕНИЕ БЛОКА ==========
function initRemoveHandlers() {
  document.querySelectorAll('.block-remove').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const id = Number(this.dataset.id);
      
      blocks = blocks.filter(b => b.id !== id);
      renderBlocks();
      window.showNotification('🗑️ Блок удалён', 'success');
    });
  });
}

// ========== ИНФОРМАЦИЯ О БЛОКЕ ==========
function initInfoHandlers() {
  document.querySelectorAll('.block-info-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const blockElement = this.closest('.block-item');
      const blockId = Number(blockElement.dataset.id);
      const block = blocks.find(b => b.id === blockId);
      
      let title = '', description = '';
      
      switch (block.type) {
        case 'text':
          title = 'Текстовый блок';
          description = 'Просто пиши текст. Можно использовать для описаний и новостей.';
          break;
        case 'image':
          title = 'Блок изображения';
          description = 'Загрузи одно изображение. Поддерживаются PNG, JPG, WEBP.';
          break;
        case 'carousel':
          title = 'Карусель';
          description = 'Добавляй несколько фото — они будут отображаться в галерее.';
          break;
        case 'table':
          title = 'Таблица';
          description = 'Создавай таблицы до 5 столбцов и 100 строк.';
          break;
        case 'video':
          title = 'Видео';
          description = 'Загружай видео до 100 MB. Поддерживаются MP4, WebM.';
          break;
        case 'quote':
          title = 'Цитата';
          description = 'Красиво оформленная цитата с автором.';
          break;
        case 'code':
          title = 'Код';
          description = 'Вставка программного кода с подсветкой синтаксиса.';
          break;
        case 'list':
          title = 'Список';
          description = 'Маркированный или нумерованный список.';
          break;
      }
      
      window.showNotification(`ℹ️ ${title}: ${description}`, 'success');
    });
  });
}

// ========== ДОБАВЛЕНИЕ НОВОГО БЛОКА ==========
window.addBlock = function(type) {
  const id = Date.now() + Math.random();
  let content = '';

  switch (type) {
    case 'text':
      content = '';
      window.showNotification('📄 Блок текста добавлен', 'success');
      break;
    case 'image':
      content = null;
      window.showNotification('🖼️ Добавьте изображение в блок', 'success');
      break;
    case 'carousel':
      content = [];
      window.showNotification('🎠 Добавьте фото в карусель', 'success');
      break;
    case 'table':
      content = {
        rows: 2,
        cols: 3,
        data: [
          ['Заголовок 1', 'Заголовок 2', 'Заголовок 3'],
          ['Ячейка 1', 'Ячейка 2', 'Ячейка 3']
        ]
      };
      window.showNotification('📊 Блок таблицы добавлен', 'success');
      break;
    case 'video':
      content = null;
      window.showNotification('🎬 Блок видео добавлен', 'success');
      break;
    case 'quote':
      content = { text: '', author: '' };
      window.showNotification('❝ Блок цитаты добавлен', 'success');
      break;
    case 'code':
      content = { code: '', language: 'javascript' };
      window.showNotification('{ } Блок кода добавлен', 'success');
      break;
    case 'list':
      content = { type: 'ul', items: ['Первый пункт', 'Второй пункт'] };
      window.showNotification('✓ Блок списка добавлен', 'success');
      break;
  }

  blocks.push({ id, type, content });
  renderBlocks();
  
  setTimeout(() => {
    const newBlock = document.querySelector(`.block-item[data-id="${id}"]`);
    if (newBlock) {
      newBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
};

// ========== ПЛАВАЮЩИЙ ДОК ==========
window.initFloatingDock = function() {
  const floatingDock = document.createElement('div');
  floatingDock.className = 'floating-dock';
  floatingDock.innerHTML = `
    <div class="dock-label">Добавление блока</div>
    <div class="dock-buttons">
      <button class="dock-btn" data-type="text">
        <span class="dock-icon-circle">📄</span>
        <span class="dock-text">Текст</span>
      </button>
      <button class="dock-btn" data-type="image">
        <span class="dock-icon-circle">🖼️</span>
        <span class="dock-text">Фото</span>
      </button>
      <button class="dock-btn" data-type="carousel">
        <span class="dock-icon-circle">🎠</span>
        <span class="dock-text">Карусель</span>
      </button>
      <button class="dock-btn" data-type="table">
        <span class="dock-icon-circle">📊</span>
        <span class="dock-text">Таблица</span>
      </button>
      <button class="dock-btn" data-type="video">
        <span class="dock-icon-circle">🎬</span>
        <span class="dock-text">Видео</span>
      </button>
      <button class="dock-btn" data-type="quote">
        <span class="dock-icon-circle">❝</span>
        <span class="dock-text">Цитата</span>
      </button>
      <button class="dock-btn" data-type="code">
        <span class="dock-icon-circle">{ }</span>
        <span class="dock-text">Код</span>
      </button>
      <button class="dock-btn" data-type="list">
        <span class="dock-icon-circle">✓</span>
        <span class="dock-text">Список</span>
      </button>
    </div>
  `;
  
  blocksContainer.parentNode.insertBefore(floatingDock, blocksContainer.nextSibling);
  
  document.querySelectorAll('.floating-dock .dock-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      window.addBlock(this.dataset.type);
    });
  });
};