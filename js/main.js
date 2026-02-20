document.addEventListener('DOMContentLoaded', function() {
  // ========== ЭЛЕМЕНТЫ ==========
  window.titleInput = document.getElementById('article-title');
  window.previewUploadArea = document.getElementById('preview-upload-area');
  window.previewUpload = document.getElementById('preview-upload');
  window.previewImage = document.getElementById('preview-image');
  window.removePreviewBtn = document.getElementById('remove-preview-btn');
  
  window.metaAuthor = document.getElementById('meta-author');
  window.metaSlug = document.getElementById('meta-slug');
  window.metaDescription = document.getElementById('meta-description');
  window.metaTime = document.getElementById('meta-time');
  
  window.comboboxSelected = document.getElementById('combobox-selected');
  window.comboboxDropdown = document.getElementById('combobox-dropdown');
  window.comboboxOptions = document.querySelectorAll('.combobox-option');
  window.selectedTagText = document.getElementById('selected-tag-text');
  window.customTagInput = document.getElementById('custom-tag-input');
  
  window.publishBtn = document.getElementById('publish-btn');
  window.previewModal = document.getElementById('preview-modal');
  window.closePreview = document.getElementById('close-preview');
  window.previewRender = document.getElementById('preview-render');

  // ========== СОСТОЯНИЕ ==========
  window.currentTag = 'РЕЛИЗ';
  window.blocks = [];

  // ========== ИНИЦИАЛИЗАЦИЯ ==========
function init() {
  // Установить время по умолчанию
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  if (metaTime) {
    metaTime.value = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Инициализация модулей
  initPreviewUpload();
  initCombobox();
  initFloatingDock();
  initPreviewModal();
  initSendButton();

  // Рендерим блоки
  renderBlocks();
  
  // Статистика
  if (typeof setupStats === 'function') setupStats();
  if (typeof updateStats === 'function') updateStats();
  
  // Эффекты
  if (typeof addMinimalRipple === 'function') addMinimalRipple();
  
  window.showNotification('✅ Редактор готов', 'success');
}
  // ========== ПРЕВЬЮ ЗАГРУЗКА ==========
function initPreviewUpload() {
  const uploadArea = document.getElementById('preview-upload-area');
  const fileInput = document.getElementById('preview-upload');
  const previewImage = document.getElementById('preview-image');
  const removeBtn = document.getElementById('remove-preview-btn');
  const placeholder = document.getElementById('preview-placeholder');
  
  if (!uploadArea || !fileInput || !previewImage) return;
  
  // Клик по области загрузки
  uploadArea.addEventListener('click', function(e) {
    // Не открываем диалог, если клик по кнопке удаления
    if (e.target === removeBtn || removeBtn.contains(e.target)) return;
    fileInput.click();
  });
  
  // Выбор файла
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      window.showNotification('❌ Можно загружать только изображения', 'error');
      return;
    }
    
    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      window.showNotification('❌ Изображение слишком большое (макс 5MB)', 'error');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(ev) {
      previewImage.src = ev.target.result;
      previewImage.classList.remove('hidden');
      
      // Скрываем область загрузки через CSS, но оставляем для возможности повторной загрузки
      uploadArea.style.display = 'none';
      
      window.showNotification('✅ Превью загружено', 'success');
      
      // Сохраняем в localStorage если есть функция
      if (typeof saveDraft === 'function') saveDraft();
    };
    
    reader.onerror = function() {
      window.showNotification('❌ Ошибка загрузки файла', 'error');
    };
    
    reader.readAsDataURL(file);
  });
  
  // Кнопка удаления
  if (removeBtn) {
    removeBtn.addEventListener('click', function() {
      previewImage.src = '';
      previewImage.classList.add('hidden');
      uploadArea.style.display = 'flex';
      fileInput.value = '';
      window.showNotification('🗑️ Превью удалено', 'success');
      
      if (typeof saveDraft === 'function') saveDraft();
    });
  }
  
  // Drag & Drop
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = 'var(--accent-blue)';
    this.style.background = 'var(--bg-element-hover)';
  });
  
  uploadArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.style.borderColor = '';
    this.style.background = '';
  });
  
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = '';
    this.style.background = '';
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      window.showNotification('❌ Можно загружать только изображения', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      window.showNotification('❌ Изображение слишком большое (макс 5MB)', 'error');
      return;
    }
    
    // Создаём событие change для fileInput
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    
    // Триггерим событие change
    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
  });
}

  // ========== КОМБОБОКС ==========
  function initCombobox() {
    comboboxSelected.addEventListener('click', function(e) {
      e.stopPropagation();
      comboboxDropdown.classList.toggle('hidden');
    });

    comboboxOptions.forEach(opt => {
      opt.addEventListener('click', function(e) {
        e.stopPropagation();
        const tag = this.dataset.tag;
        
        if (tag === 'custom') {
          customTagInput.classList.remove('hidden');
          customTagInput.focus();
        } else {
          customTagInput.classList.add('hidden');
          window.currentTag = tag;
          selectedTagText.textContent = tag;
        }
        comboboxDropdown.classList.add('hidden');
      });
    });

    customTagInput.addEventListener('input', function() {
      if (this.value.trim()) {
        window.currentTag = this.value.trim();
        selectedTagText.textContent = window.currentTag;
      }
    });

    document.addEventListener('click', function(e) {
      if (!comboboxSelected.contains(e.target)) {
        comboboxDropdown.classList.add('hidden');
      }
    });
  }

  // ========== ОТПРАВКА ==========
  function initSendButton() {
    publishBtn.addEventListener('click', async function() {
      if (typeof exportToServer === 'function') {
        await exportToServer();
      }
    });
  }

  // Запуск
  init();

  // Загружаем демо-превью (для теста)
function loadDemoPreview() {
  const previewImage = document.getElementById('preview-image');
  const uploadArea = document.getElementById('preview-upload-area');
  
  // Создаём тестовое изображение (серый квадрат с текстом)
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  // Рисуем градиентный фон
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#0a84ff');
  gradient.addColorStop(1, '#5e5ceb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Рисуем текст
  ctx.fillStyle = 'white';
  ctx.font = 'bold 40px -apple-system';
  ctx.textAlign = 'center';
  ctx.fillText('Превью статьи', canvas.width/2, canvas.height/2);
  
  // Конвертируем в data URL
  previewImage.src = canvas.toDataURL('image/png');
  previewImage.classList.remove('hidden');
  uploadArea.style.display = 'none';
}

// Загружаем демо-превью (раскомментируй для теста)
// loadDemoPreview();
});