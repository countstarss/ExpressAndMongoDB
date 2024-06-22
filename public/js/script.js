// 存储滚动位置
window.addEventListener('beforeunload', function() {
  sessionStorage.setItem('scrollPosition', JSON.stringify({
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset
  }));
});

// 加载时恢复滚动位置
window.addEventListener('load', function() {
  const scrollPosition = JSON.parse(sessionStorage.getItem('scrollPosition'));
  if (scrollPosition) {
      window.scrollTo({
          top: scrollPosition.y,
          left: scrollPosition.x,
          behavior: 'smooth' // 可选的，平滑滚动到指定位置
          
      });
      sessionStorage.removeItem('scrollPosition'); // 清除存储的位置信息
  }
});



document.addEventListener('DOMContentLoaded', function(){

  const allButtons = document.querySelectorAll('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');

  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener('click', function() {
      searchBar.style.visibility = 'visible';
      searchBar.classList.add('open');
      this.setAttribute('aria-expanded', 'true');
      searchInput.focus();
    });
  }
  // Close按键的动作
  searchClose.addEventListener('click', function() {
    searchBar.style.visibility = 'hidden';
    searchBar.classList.remove('open');
    this.setAttribute('aria-expanded', 'false');
  });
});
