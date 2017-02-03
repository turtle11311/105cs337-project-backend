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
    var Range = ace.require("ace/range").Range
            editor.setSession(new ace.EditSession(data));
            editor.$blockScrolling = Infinity;
            editor.getSession().setMode(`ace/mode/${filetype(node.key)}`);
              var t = '{"Data":[{"op"   : "-","code" : "1111","line" : "1"},{"op":"*","code" : "8_2_9_2_10_2_11_2_12_2_13_2_","line" : "5"},{ "op"   : "+","code" : "111111","line" : "6"}]} ';
  var getContact = JSON.parse(t);
    console.log(getContact.Data[0].line);
    var res = getContact.Data[1].code.split("_");
    console.log(res[0]);
              editor.session.addMarker(new Range(getContact.Data[0].line,0, getContact.Data[0].line,5),"myMarker","fullLine");

              editor.session.addMarker(new Range(getContact.Data[1].line,1, getContact.Data[1].line,2),"myMarker");
            var num = Number(5);
            text=editor.getSession().getLength() ;



          }
});

      }
    });
});

}
