window.onload = function() {
  chrome.storage.sync.get(null, function(items) {
      document.getElementById('units').value = (items.units ? items.units : "us");
      document.getElementById('units').addEventListener('change', function() {
        chrome.storage.sync.set({'units': document.getElementById('units').value});
      });
      document.getElementById('colorpicker').value = (items.color ? items.color : "#000000");
      document.getElementById('colorpicker').addEventListener('change', function() {
        chrome.storage.sync.set({'color': document.getElementById('colorpicker').value});
      });
	  
	  var nsl, j, patterns = items['patterns'], _match_list = document.getElementById('zips_list');

      nsl = typeof patterns == "undefined" ? -1 : patterns.length;
      if (nsl > 0) {
        for (j = 0; j < nsl; j++) {
          addNote(patterns[j]);
        }
      }
	  document.getElementById('add-zip').onclick = addNote;
  });
};

// window.onunload = saveNote;