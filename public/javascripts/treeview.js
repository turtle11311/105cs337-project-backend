var filetype = (filename) => {
  var ext = filename.split('.').pop();
  var res = ext_map.find((elem) => {
    if (elem.ext.includes(ext))
      return true;
  });
  return res ? res.name : 'plain_text';
};

function loadTreeview() {
  $(() => {
    $('#tree').remove();
    $('div.treeView').append($('<div></div>').attr('id', 'tree'));
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
          url: `/apis/fs/${repo}/${node.key}`,
          success: (data, textStatus, jqXHR) => {
            nowFile = node.key;
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
}