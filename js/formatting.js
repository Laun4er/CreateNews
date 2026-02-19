// ========== ПАНЕЛЬ ФОРМАТИРОВАНИЯ ==========
let activeFormatArea = null;
let formatToolbar = null;

function createFormatToolbar() {
  if (formatToolbar) return;
  
  formatToolbar = document.createElement('div');
  formatToolbar.className = 'format-toolbar';
  formatToolbar.style.cssText = `
    position: absolute;
    background: var(--glass-bg);
    backdrop-filter: blur(var(--blur-amount));
    border: 1px solid var(--glass-border);
    border-radius: 30px;
    padding: 8px;
    display: flex;
    gap: 4px;
    box-shadow: var(--glass-shadow);
    z-index: 1000;
    display: none;
  `;
  
  formatToolbar.innerHTML = `
    <button class="format-btn" data-format="bold" title="Жирный (Ctrl+B)"><b>B</b></button>
    <button class="format-btn" data-format="italic" title="Курсив (Ctrl+I)"><i>I</i></button>
    <button class="format-btn" data-format="underline" title="Подчеркнутый (Ctrl+U)"><u>U</u></button>
    <button class="format-btn" data-format="link" title="Ссылка (Ctrl+K)">🔗</button>
  `;
  
  document.body.appendChild(formatToolbar);
  
  // Стили для кнопок
  const style = document.createElement('style');
  style.textContent = `
    .format-btn {
      background: none;
      border: none;
      color: var(--text-primary);
      width: 36px;
      height: 36px;
      border-radius: 18px;
      cursor: pointer;
      font-size: 1rem;
      transition: all var(--transition-fast);
    }
    .format-btn:hover {
      background: var(--bg-tertiary);
    }
  `;
  document.head.appendChild(style);
  
  // Обработчики
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const format = this.dataset.format;
      applyFormat(format);
    });
  });
}

function showFormatToolbar(target) {
  if (!target || target.tagName !== 'TEXTAREA') {
    if (formatToolbar) formatToolbar.style.display = 'none';
    return;
  }
  
  if (target.selectionStart === target.selectionEnd) {
    if (formatToolbar) formatToolbar.style.display = 'none';
    return;
  }
  
  if (!formatToolbar) createFormatToolbar();
  
  const rect = target.getBoundingClientRect();
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const selectionRect = range.getBoundingClientRect();
  
  activeFormatArea = target;
  
  formatToolbar.style.display = 'flex';
  formatToolbar.style.top = `${selectionRect.top - 50 + window.scrollY}px`;
  formatToolbar.style.left = `${selectionRect.left + (selectionRect.width / 2) - 80}px`;
}

function applyFormat(format) {
  if (!activeFormatArea) return;
  
  const start = activeFormatArea.selectionStart;
  const end = activeFormatArea.selectionEnd;
  const selectedText = activeFormatArea.value.substring(start, end);
  
  if (!selectedText) return;
  
  let wrappedText = '';
  
  switch (format) {
    case 'bold':
      wrappedText = `**${selectedText}**`;
      break;
    case 'italic':
      wrappedText = `*${selectedText}*`;
      break;
    case 'underline':
      wrappedText = `_${selectedText}_`;
      break;
    case 'link':
      const url = prompt('Введите ссылку:', 'https://');
      if (url) {
        wrappedText = `[${selectedText}](${url})`;
      } else {
        return;
      }
      break;
  }
  
  activeFormatArea.value = 
    activeFormatArea.value.substring(0, start) + 
    wrappedText + 
    activeFormatArea.value.substring(end);
  
  activeFormatArea.selectionStart = start;
  activeFormatArea.selectionEnd = start + wrappedText.length;
  activeFormatArea.focus();
  
  if (formatToolbar) formatToolbar.style.display = 'none';
  window.showNotification(`✨ Формат применён`, 'success');
}

// Отслеживание выделения
document.addEventListener('mouseup', function(e) {
  if (e.target.tagName === 'TEXTAREA') {
    setTimeout(() => showFormatToolbar(e.target), 10);
  }
});

document.addEventListener('keyup', function(e) {
  if (e.target.tagName === 'TEXTAREA') {
    setTimeout(() => showFormatToolbar(e.target), 10);
  }
});

// Горячие клавиши
document.addEventListener('keydown', function(e) {
  const activeElement = document.activeElement;
  
  if (activeElement && activeElement.tagName === 'TEXTAREA') {
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      activeFormatArea = activeElement;
      applyFormat('bold');
    }
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      activeFormatArea = activeElement;
      applyFormat('italic');
    }
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      activeFormatArea = activeElement;
      applyFormat('underline');
    }
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      activeFormatArea = activeElement;
      applyFormat('link');
    }
  }
});