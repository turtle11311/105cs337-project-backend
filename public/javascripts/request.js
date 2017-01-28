function op() {
  let method = $('input#reqmethod')[0].value;
  let url = $('input#requrl')[0].value;
  let data = $('textarea#reqdata')[0].value;
  $.ajax({
    url: url,
    method: method,
    contentType: 'application/json',
    data: data,
    dataType: 'json'
  });
}

function clone() {
  var url = 'https://github.com/turtle11311/105cs337-project-backend';
  var newRepoName = '105cs337-project-backend';
  $.ajax({
    method: 'POST',
    url: `/apis/git/cloneto/${newRepoName}`,
    contentType: 'application/json',
    data: JSON.stringify({ url: url }),
    dataType: 'json'
  });
}

function save(){
  var content = ace.edit('editor').getValue();
  console.log(content);
  $.ajax({
    method: 'PUT',
    url: `/apis/fs/${repo}/${nowFile}`,
    contentType: 'application/json',
    data: JSON.stringify({ content: content }),
    dataType: 'json'
  });
}

function remove() {
  var selNodes = $("#tree").fancytree("getTree").getSelectedNodes();
  selNodes.forEach((node) => {
    $.ajax({
      method: 'DELETE',
      url: `/apis/fs/${repo}/${node.key}`,
      success: (data, status, XHR) => {
        node.remove();
      }
    });
  });
}