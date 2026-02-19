// ========== ЭКСПОРТ ==========
window.exportToServer = async function() {
  try {
    window.showNotification('📦 Подготовка экспорта...', 'success');
    window.showLoading();

    const titleInput = document.getElementById('article-title');
    const previewImage = document.getElementById('preview-image');
    const metaAuthor = document.getElementById('meta-author');
    const metaSlug = document.getElementById('meta-slug');
    const metaDescription = document.getElementById('meta-description');
    const metaTime = document.getElementById('meta-time');

    if (!titleInput.value.trim()) {
      window.showNotification('❌ Название статьи обязательно!', 'error');
      window.hideLoading();
      return;
    }
    
    if (!previewImage.src || previewImage.classList.contains('hidden')) {
      window.showNotification('❌ Превью-картинка обязательна!', 'error');
      window.hideLoading();
      return;
    }

    const meta = {
      title: titleInput.value.trim(),
      slug: metaSlug.value.trim() || titleInput.value.trim().toLowerCase().replace(/[^a-z0-9]/gi, '-'),
      description: metaDescription.value.trim() || 'Краткое описание',
      tag: window.currentTag,
      author: metaAuthor.value.trim() || 'Редактор',
      publishedAt: metaTime.value || new Date().toISOString().slice(0,16),
      createdAt: new Date().toISOString(),
      blocks: blocks.map(block => {
        const { id, ...blockData } = block;
        return blockData;
      })
    };

    // Создаём ZIP
    const zip = new JSZip();
    zip.file('article.json', JSON.stringify(meta, null, 2));
    
    // Добавляем HTML
    const htmlContent = generateHTML(meta);
    zip.file('index.html', htmlContent);

    // Генерируем ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Отправляем
    const formData = new FormData();
    formData.append('zip', zipBlob, `${meta.slug || 'article'}.zip`);

    // Здесь должен быть твой URL
    const serverUrl = 'https://твой-сайт.ru/api/upload';

    window.showNotification('📤 Отправка на сервер...', 'success');

    const response = await fetch(serverUrl, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      window.showNotification('✅ Статья отправлена!', 'success');
    } else {
      throw new Error('Ошибка сервера');
    }

  } catch (error) {
    console.error('Export error:', error);
    window.showNotification('❌ Ошибка отправки', 'error');
  } finally {
    window.hideLoading();
  }
};

function generateHTML(meta) {
  // Простая HTML-генерация
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${meta.title}</title>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f7; }
    .article { background: white; border-radius: 20px; padding: 32px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
    h1 { font-size: 2rem; margin-bottom: 16px; }
    .meta { color: #666; margin-bottom: 24px; }
  </style>
</head>
<body>
  <div class="article">
    <h1>${meta.title}</h1>
    <div class="meta">${meta.author} • ${new Date(meta.publishedAt).toLocaleDateString()}</div>
    <p>${meta.description}</p>
  </div>
</body>
</html>`;
}