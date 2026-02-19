// ========== ПОИСК ПО БЛОКАМ ==========
let searchMatches = [];
let currentMatchIndex = -1;
let searchString = '';

function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchPrev = document.getElementById('search-prev');
  const searchNext = document.getElementById('search-next');
  const searchClear = document.getElementById('search-clear');
  
  let searchTimeout;
  
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchString = this.value.trim();
      
      if (searchString.length < 2) {
        searchMatches = [];
        currentMatchIndex = -1;
        clearHighlights();
        updateSearchResults();
        return;
      }
      
      searchMatches = searchInBlocks(searchString);
      currentMatchIndex = searchMatches.length > 0 ? 0 : -1;
      
      if (searchMatches.length > 0) {
        highlightMatches(searchMatches);
        showNotification(`🔍 Найдено ${searchMatches.length} совпадений`, 'success');
      } else {
        clearHighlights();
        showNotification('🔍 Ничего не найдено', 'error');
      }
      
      updateSearchResults();
    }, 300);
  });
  
  searchPrev.addEventListener('click', function() {
    if (searchMatches.length === 0) return;
    
    currentMatchIndex--;
    if (currentMatchIndex < 0) currentMatchIndex = searchMatches.length - 1;
    
    highlightMatches(searchMatches);
    updateSearchResults();
  });
  
  searchNext.addEventListener('click', function() {
    if (searchMatches.length === 0) return;
    
    currentMatchIndex++;
    if (currentMatchIndex >= searchMatches.length) currentMatchIndex = 0;
    
    highlightMatches(searchMatches);
    updateSearchResults();
  });
  
  searchClear.addEventListener('click', function() {
    searchInput.value = '';
    searchString = '';
    searchMatches = [];
    currentMatchIndex = -1;
    clearHighlights();
    updateSearchResults();
    showNotification('🧹 Поиск очищен', 'success');
  });
}

function searchInBlocks(query) {
  if (!query || query.length < 2) {
    clearHighlights();
    return [];
  }
  
  const matches = [];
  const blocks = document.querySelectorAll('.block-item');
  
  blocks.forEach((block, blockIndex) => {
    const textElements = block.querySelectorAll('.editor-textarea, .quote-textarea, .code-textarea, .list-item-input, .block-name-input');
    
    textElements.forEach(element => {
      if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        const text = element.value || '';
        const lowerQuery = query.toLowerCase();
        const lowerText = text.toLowerCase();
        
        let index = lowerText.indexOf(lowerQuery);
        while (index !== -1) {
          matches.push({
            blockIndex,
            element,
            start: index,
            end: index + query.length,
            text: text.substring(index, index + query.length)
          });
          index = lowerText.indexOf(lowerQuery, index + 1);
        }
      }
    });
  });
  
  return matches;
}

function highlightMatches(matches) {
  clearHighlights();
  
  matches.forEach((match, idx) => {
    const element = match.element;
    
    if (!element.hasAttribute('data-original')) {
      element.setAttribute('data-original', element.value);
    }
    
    if (idx === currentMatchIndex) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.style.border = '3px solid #ffaa5e';
      element.style.transition = 'all 0.2s';
    } else {
      element.style.border = '2px solid #8a8ad8';
    }
  });
  
  updateSearchResults();
}

function clearHighlights() {
  document.querySelectorAll('.editor-textarea, .quote-textarea, .code-textarea, .list-item-input, .block-name-input').forEach(el => {
    el.style.border = '';
  });
}

function updateSearchResults() {
  const resultsEl = document.getElementById('search-results');
  const prevBtn = document.getElementById('search-prev');
  const nextBtn = document.getElementById('search-next');
  
  if (searchMatches.length === 0) {
    resultsEl.textContent = '0 результатов';
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  } else {
    resultsEl.textContent = `${currentMatchIndex + 1} из ${searchMatches.length}`;
    prevBtn.disabled = currentMatchIndex <= 0;
    nextBtn.disabled = currentMatchIndex >= searchMatches.length - 1;
  }
}