var ext_map = [{name: 'javascript', ext: ['js']}, {name:'json', ext:['json']}, {name: 'c_cpp', ext: ['c', 'cc', 'cpp', 'h', 'hpp']}, {name: 'python', ext: ['py']}, {name: 'html', ext: ['html', 'htm']}, {name: 'coffee', ext:['coffee']}, {name: 'typescript', ext:['ts']}, {name: 'markdown', ext:['md']}, {name: 'scss', ext: ['scss']}, {name:'sass', ext: ['sass']}, {name: 'ejs', ext: ['ejs']}];
var filetype = (filename) => {
  var ext = filename.split('.').pop();
  var res = ext_map.find((elem) => {
    if (elem.ext.includes(ext))
      return true;
  });
  return res ? res.name : 'plain_text';
};


$(() => {
  // Create the tree inside the <div id="tree"> element.
  $('#tree').fancytree({
    source: {
      url: `/apis/fs/ls/${repo}`
    },
    checkbox: true,
    activate: function (event, data) {
      // A node was activated: display its title:
      var node = data.node;
      if (node.folder) return;
      $.ajax({
        method: 'GET',
        url: `/apis/fs/get/${repo}/${node.key}`,
        success: (data, textStatus, jqXHR) => {
          var editor = ace.edit('editor');
          editor.$blockScrolling = Infinity;
          editor.setValue(data);
          editor.clearSelection();
          editor.session.setMode(`ace/mode/${filetype(node.key)}`);
        }
      });
    }
  });
});