// ========== СТАТИСТИКА ==========
window.updateStats = function() {
  const stats = {
    total: blocks.length,
    text: blocks.filter(b => b.type === 'text').length,
    image: blocks.filter(b => b.type === 'image').length,
    carousel: blocks.filter(b => b.type === 'carousel').length,
    table: blocks.filter(b => b.type === 'table').length,
    video: blocks.filter(b => b.type === 'video').length,
    quote: blocks.filter(b => b.type === 'quote').length,
    code: blocks.filter(b => b.type === 'code').length,
    list: blocks.filter(b => b.type === 'list').length,
  };
  
  let totalWords = 0;
  
  blocks.forEach(block => {
    if (block.type === 'text' && block.content) {
      totalWords += block.content.split(/\s+/).filter(w => w.length > 0).length;
    } else if (block.type === 'quote' && block.content?.text) {
      totalWords += block.content.text.split(/\s+/).filter(w => w.length > 0).length;
    } else if (block.type === 'list' && block.content?.items) {
      block.content.items.forEach(item => {
        totalWords += (item || '').split(/\s+/).filter(w => w.length > 0).length;
      });
    }
  });
  
  const readTime = Math.max(1, Math.ceil(totalWords / 200));
  
  document.getElementById('stat-total-blocks').textContent = stats.total;
  document.getElementById('stat-text-blocks').textContent = stats.text;
  document.getElementById('stat-image-blocks').textContent = stats.image;
  document.getElementById('stat-carousel-blocks').textContent = stats.carousel;
  document.getElementById('stat-table-blocks').textContent = stats.table;
  document.getElementById('stat-video-blocks').textContent = stats.video;
  document.getElementById('stat-quote-blocks').textContent = stats.quote;
  document.getElementById('stat-code-blocks').textContent = stats.code;
  document.getElementById('stat-list-blocks').textContent = stats.list;
  document.getElementById('stat-words').textContent = totalWords;
  document.getElementById('stat-read-time').textContent = readTime + ' мин';
};

window.setupStats = function() {
  // Обновляем после каждого рендера
  const originalRender = window.renderBlocks;
  window.renderBlocks = function() {
    originalRender();
    window.updateStats();
  };
  
  // Обновляем каждые 5 секунд
  setInterval(window.updateStats, 5000);
};