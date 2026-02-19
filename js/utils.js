// ========== УВЕДОМЛЕНИЯ ==========
const notificationContainer = document.createElement('div');
notificationContainer.className = 'notification-container';
document.body.appendChild(notificationContainer);

window.showNotification = function(message, type = 'success') {
  const id = Date.now();
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.dataset.id = id;
  
  const icon = type === 'success' ? '✓' : '⚠️';
  
  notification.innerHTML = `
    <span class="notification-icon">${icon}</span>
    <span class="notification-content">${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">✕</button>
  `;
  
  notificationContainer.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
};

// ========== ЗАГРУЗЧИК ======
const loadingSpinner = document.createElement('div');
loadingSpinner.className = 'loading-spinner';
loadingSpinner.style.cssText = `
  position: fixed;
  top: 20px;
  left: 20px;
  width: 24px;
  height: 24px;
  border: 2px solid var(--glass-border);
  border-top-color: var(--accent-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: none;
  z-index: 10002;
`;
document.body.appendChild(loadingSpinner);

// Добавляем стили для спиннера
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

window.showLoading = function() {
  loadingSpinner.style.display = 'block';
};

window.hideLoading = function() {
  loadingSpinner.style.display = 'none';
};

// ========== МИНИМАЛИСТИЧНЫЙ RIPPLE ЭФФЕКТ ==========
window.addMinimalRipple = function() {
  document.querySelectorAll('.primary-button, .secondary-button, .dock-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
        transform: scale(0);
        animation: minimalRipple 0.4s linear;
        pointer-events: none;
      `;
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size/2 + 'px';
      ripple.style.top = e.clientY - rect.top - size/2 + 'px';
      
      this.style.position = 'relative';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 400);
    });
  });
};

// Добавляем стили для ripple
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes minimalRipple {
    from { transform: scale(0); opacity: 0.3; }
    to { transform: scale(2); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);