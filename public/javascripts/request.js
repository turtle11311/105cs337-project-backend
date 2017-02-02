var test;
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

function init() {
  bootbox.prompt('Repository Name', (res) => {
    repo = res;
    $.ajax({
      method: 'POST',
      url: `/apis/git/init/${res}`,
      contentType: 'application/json',
      data: JSON.stringify({}),
      dataType: 'json',
    });
  });
}

function clone() {
  var url = '';
  var newRepoName = '';
  bootbox.prompt('Git repository url', (res) => {
    url = res;
    repo = newRepoName;
    $.ajax({
      method: 'POST',
      url: `/apis/git/cloneto/${newRepoName}`,
      contentType: 'application/json',
      data: JSON.stringify({
        url: url
      }),
      dataType: 'json',
    });
  });
  bootbox.prompt('Repository Name', (res) => {
    newRepoName = res;
  });
}

function save() {
  var content = ace.edit('editor').getValue();
  console.log(content);
  $.ajax({
    method: 'PUT',
    url: `/apis/fs/${repo}/${nowFile}`,
    contentType: 'application/json',
    data: JSON.stringify({
      content: content
    }),
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

function listRepos() {
  $.ajax({
    method: 'GET',
    url: `/apis/fs/repos`,
    success: (data, status, XHR) => {
      bootbox.prompt({
        title: "This is a prompt with select!",
        inputType: 'select',
        inputOptions: [{text: 'Choose one...', value: ''}].concat(data.map(o => new Object({text: o, value: o}))),
        callback: function (result) {
          repo = result;
          loadTreeview();
        }
      });
    }
  });
}