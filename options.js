window.onload = function() {
  chrome.storage.local.get(null, function(items) {
      document.getElementById('units').value = (items.units ? items.units : "us");
      document.getElementById('units').addEventListener('change', function() {
        chrome.storage.local.set({'units': document.getElementById('units').value});
      });
      document.getElementById('colorpicker').value = (items.color ? items.color : "#000000");
      document.getElementById('colorpicker').addEventListener('change', function() {
        chrome.storage.local.set({'color': document.getElementById('colorpicker').value});
      });
  });
};
