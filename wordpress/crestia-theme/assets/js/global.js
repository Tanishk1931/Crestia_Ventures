(function () {
  document.documentElement.classList.add('js');

  var yearNodes = document.querySelectorAll('#yr, #medical-year');
  var year = String(new Date().getFullYear());
  yearNodes.forEach(function (node) {
    node.textContent = year;
  });
})();
