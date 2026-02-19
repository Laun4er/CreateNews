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
    metaTime.value = now.toISOString().slice(0, 16);

    // Инициализация модулей
    initPreviewUpload();
    initCombobox();
    initFloatingDock();
    initPreviewModal();
    initSendButton();
    
    // Демо-блоки
    blocks.push({
      id: Date.now() + 1,
      type: 'text',
      content: 'Пример текстового блока. Здесь можно писать что угодно.'
    });

    // Рендерим
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
    previewUploadArea.addEventListener('click', () => previewUpload.click());
    
    previewUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          previewImage.src = ev.target.result;
          previewImage.classList.remove('hidden');
          previewUploadArea.style.display = 'none';
          window.showNotification('✅ Превью загружено', 'success');
        };
        reader.readAsDataURL(file);
      }
    });

    removePreviewBtn.addEventListener('click', function() {
      previewImage.src = '';
      previewImage.classList.add('hidden');
      previewUploadArea.style.display = 'flex';
      previewUpload.value = '';
      window.showNotification('🗑️ Превью удалено', 'success');
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

  // ========== ПРЕДПРОСМОТР ==========
  function initPreviewModal() {
    const previewBtn = document.getElementById('preview-btn');
    if (!previewBtn) return;
    
    previewBtn.addEventListener('click', function() {
      previewRender.innerHTML = generatePreview();
      previewModal.classList.remove('hidden');
    });

    closePreview.addEventListener('click', () => {
      previewModal.classList.add('hidden');
    });
  }

  function generatePreview() {
    // Простая генерация превью
    return `<div style="padding: 20px;">Превью статьи</div>`;
  }

  // Запуск
  init();
});