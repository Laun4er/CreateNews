// ========== АВТОСОХРАНЕНИЕ ==========
const STORAGE_KEY = 'article_draft';
function saveDraft() {
  const draft = {
    title: titleInput.value,
    preview: previewImage.src,
    tag: currentTag,
    customTag: customTagInput.value,
    meta: {
      author: metaAuthor.value,
      slug: metaSlug.value,
      description: metaDescription.value,
      time: metaTime.value
      // user удалён
    },
    blocks: blocks.map(block => ({
      ...block,
      name: block.name
    })),
    lastSaved: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  
  const saveIndicator = document.getElementById('save-indicator');
  if (saveIndicator) {
    saveIndicator.style.opacity = '1';
    saveIndicator.style.background = '#4caf50';
    setTimeout(() => {
      saveIndicator.style.opacity = '0.5';
    }, 200);
  }
  
  localStorage.setItem('last_saved_time', new Date().toISOString());
}
function loadDraft() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return false;
  
  try {
    const draft = JSON.parse(saved);
    
    titleInput.value = draft.title || '';
    currentTag = draft.tag || 'РЕЛИЗ';
    selectedTagText.textContent = currentTag;
    
    if (draft.preview && draft.preview !== previewImage.src) {
      previewImage.src = draft.preview;
      previewImage.classList.remove('hidden');
      previewImage.style.display = 'block';
      previewUploadArea.style.display = 'none';
    }
    
    if (draft.meta) {
      metaAuthor.value = draft.meta.author || '';
      metaSlug.value = draft.meta.slug || '';
      metaDescription.value = draft.meta.description || '';
      metaTime.value = draft.meta.time || metaTime.value;
      // meta.user удалён
    }
    
    if (draft.customTag) {
      customTagInput.value = draft.customTag;
      customTagInput.style.display = 'block';
    }
    
    if (draft.blocks && draft.blocks.length > 0) {
      blocks = draft.blocks;
      renderBlocks();
    }
    
    showNotification('💾 Черновик восстановлен', 'success');
    return true;
  } catch (e) {
    console.error('Ошибка загрузки черновика:', e);
    return false;
  }
}

function setupAutosave() {
  const saveEvents = ['input', 'change', 'click'];
  
  [titleInput, metaAuthor, metaSlug, metaDescription, metaTime, metaUser, customTagInput].forEach(input => {
    if (input) {
      saveEvents.forEach(event => {
        input.addEventListener(event, saveDraft);
      });
    }
  });
  
  comboboxOptions.forEach(opt => {
    opt.addEventListener('click', function() {
      setTimeout(saveDraft, 100);
    });
  });
  
  setInterval(saveDraft, 30000);
  
  const saveIndicator = document.createElement('div');
  saveIndicator.id = 'save-indicator';
  saveIndicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #4caf50;
    box-shadow: 0 0 10px #4caf50;
    transition: opacity 0.3s;
    z-index: 9999;
    opacity: 0.5;
  `;
  saveIndicator.title = 'Автосохранение активно';
  document.body.appendChild(saveIndicator);
}

if (typeof clearDraftBtn !== 'undefined') {
  clearDraftBtn.addEventListener('click', function() {
    if (confirm('Удалить сохранённый черновик?')) {
      localStorage.removeItem(STORAGE_KEY);
      showNotification('🗑️ Черновик очищен', 'success');
    }
  });
}

// ========== КАСТОМНЫЙ MESSAGEBOX ==========
function showConfirmDialog(message, onConfirm, onCancel) {
  // Проверяем, не открыт ли уже диалог
  if (document.querySelector('.confirm-overlay')) {
    return;
  }
  
  // Затемняющий фон
  const overlay = document.createElement('div');
  overlay.className = 'modal confirm-overlay';
  overlay.style.backgroundColor = 'rgba(0,0,0,0)';
  overlay.style.backdropFilter = 'blur(0)';
  overlay.style.transition = 'all 0.2s ease';
  
  // Диалог
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog';
  dialog.innerHTML = `
    <div class="confirm-icon">⚠️</div>
    <div class="confirm-message">${message}</div>
    <div class="confirm-buttons">
      <button class="confirm-btn confirm-yes">Да, очистить</button>
      <button class="confirm-btn confirm-no">Отмена</button>
    </div>
  `;
  
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  
  // Анимация появления
  setTimeout(() => {
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.backdropFilter = 'blur(4px)';
  }, 10);
  
  // Обработчики
  const yesBtn = dialog.querySelector('.confirm-yes');
  const noBtn = dialog.querySelector('.confirm-no');
  
  const closeDialog = (callback) => {
    overlay.style.backgroundColor = 'rgba(0,0,0,0)';
    overlay.style.backdropFilter = 'blur(0)';
    setTimeout(() => {
      if (overlay.parentNode) {
        document.body.removeChild(overlay);
      }
      if (callback) callback();
    }, 200);
  };
  
  yesBtn.addEventListener('click', () => {
    closeDialog(onConfirm);
  });
  
  noBtn.addEventListener('click', () => {
    closeDialog(onCancel);
  });
  
  // Закрытие по Escape
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      document.removeEventListener('keydown', escHandler);
      noBtn.click();
    }
  };
  document.addEventListener('keydown', escHandler);
  
  // Закрытие по клику на фон
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      noBtn.click();
    }
  });
}

// ========== АВТОСОХРАНЕНИЕ ==========
function saveDraft() {
  const draft = {
    title: titleInput.value,
    preview: previewImage.src,
    tag: currentTag,
    customTag: customTagInput.value,
    meta: {
      author: metaAuthor.value,
      slug: metaSlug.value,
      description: metaDescription.value,
      time: metaTime.value
    },
    blocks: blocks.map(block => ({
      ...block,
      name: block.name
    })),
    lastSaved: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  
  const saveIndicator = document.getElementById('save-indicator');
  if (saveIndicator) {
    saveIndicator.style.opacity = '1';
    saveIndicator.style.background = '#4caf50';
    setTimeout(() => {
      saveIndicator.style.opacity = '0.5';
    }, 200);
  }
  
  localStorage.setItem('last_saved_time', new Date().toISOString());
}

function loadDraft() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return false;
  
  try {
    const draft = JSON.parse(saved);
    
    titleInput.value = draft.title || 'Заголовок новости';
    currentTag = draft.tag || 'РЕЛИЗ';
    selectedTagText.textContent = currentTag;
    
    if (draft.preview && draft.preview !== previewImage.src && draft.preview.startsWith('data:image')) {
      previewImage.src = draft.preview;
      previewImage.classList.remove('hidden');
      previewImage.style.display = 'block';
      previewUploadArea.style.display = 'none';
    }
    
    if (draft.meta) {
      metaAuthor.value = draft.meta.author || 'Редактор';
      metaSlug.value = draft.meta.slug || 'zagolovok-novosti';
      metaDescription.value = draft.meta.description || 'Краткое описание новости';
      metaTime.value = draft.meta.time || metaTime.value;
    }
    
    if (draft.customTag) {
      customTagInput.value = draft.customTag;
      customTagInput.style.display = 'block';
    }
    
    if (draft.blocks && draft.blocks.length > 0) {
      blocks = draft.blocks;
      renderBlocks();
    }
    
    showNotification('💾 Черновик восстановлен', 'success');
    return true;
  } catch (e) {
    console.error('Ошибка загрузки черновика:', e);
    return false;
  }
}

function setupAutosave() {
  const saveEvents = ['input', 'change', 'click'];
  
  [titleInput, metaAuthor, metaSlug, metaDescription, metaTime, customTagInput].forEach(input => {
    if (input) {
      saveEvents.forEach(event => {
        input.addEventListener(event, saveDraft);
      });
    }
  });
  
  comboboxOptions.forEach(opt => {
    opt.addEventListener('click', function() {
      setTimeout(saveDraft, 100);
    });
  });
  
  setInterval(saveDraft, 30000);
  
  const saveIndicator = document.createElement('div');
  saveIndicator.id = 'save-indicator';
  saveIndicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #4caf50;
    box-shadow: 0 0 10px #4caf50;
    transition: opacity 0.3s;
    z-index: 9999;
    opacity: 0.5;
  `;
  saveIndicator.title = 'Автосохранение активно';
  document.body.appendChild(saveIndicator);
}

// ========== ОЧИСТКА ЧЕРНОВИКА ==========
if (typeof clearDraftBtn !== 'undefined') {
  clearDraftBtn.addEventListener('click', function() {
    showConfirmDialog(
      'Вы уверены, что хотите удалить все блоки? Это действие нельзя отменить.',
      function() { // onConfirm
        // Очищаем блоки
        blocks = [];
        renderBlocks();
        
        // Очищаем localStorage
        localStorage.removeItem(STORAGE_KEY);
        
        // Сбрасываем превью
        previewImage.src = '';
        previewImage.classList.add('hidden');
        previewImage.style.display = 'none';
        previewUploadArea.style.display = 'flex';
        previewUpload.value = '';
        
        // Сбрасываем заголовок
        titleInput.value = 'Заголовок новости';
        
        // Сбрасываем тег
        currentTag = 'РЕЛИЗ';
        selectedTagText.textContent = 'РЕЛИЗ';
        customTagInput.style.display = 'none';
        customTagInput.value = '';
        
        // Сбрасываем мета-данные
        metaAuthor.value = 'Редактор';
        metaSlug.value = 'zagolovok-novosti';
        metaDescription.value = 'Краткое описание новости';
        
        // Устанавливаем текущее время
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        metaTime.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        
        // Обновляем статистику
        if (typeof updateStats === 'function') updateStats();
        
        showNotification('🧹 Все блоки удалены', 'success');
      },
      function() { // onCancel
        showNotification('❌ Очистка отменена', 'error');
      }
    );
  });
}