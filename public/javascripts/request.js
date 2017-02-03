
function init() {
  bootbox.prompt('Repository Name', (res) => {
    let r = undefined;
    $.ajax({
      method: 'POST',
      url: `/apis/git/init/${res}`,
      contentType: 'application/json',
      data: JSON.stringify({}),
      dataType: 'json'
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
      dataType: 'json'
    });
  });
  bootbox.prompt('Repository Name', (res) => {
    newRepoName = res;
  });
}

function save() {
  var content = ace.edit('editor').getValue();
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

function commit() {
  var selNodes = $("#tree").fancytree("getTree").getSelectedNodes();
  var fileList = selNodes.map(node => node.key);
  bootbox.prompt('Commit massage', (res) => {
    $.ajax({
      method: 'POST',
      url: `/apis/git/commit/${repo}`,
      contentType: 'application/json',
      data: JSON.stringify({
        authorname: 'TurtleBee',
        authoremail: 'turtle11311@gmail.com',
        massage: res
      }),
      dataType: 'json'
    });
  });

}

function listRepos() {
  $.ajax({
    method: 'GET',
    url: `/apis/fs/repos`,
    success: (data, status, XHR) => {
      bootbox.prompt({
        title: "Select a repository",
        inputType: 'select',
        inputOptions: [{text: 'Choose one...', value: ''}].concat(data.map(o => new Object({text: o, value: o}))),
        callback: (result) => {
          repo = result;
          loadTreeview();
        }
      });
    }
  });
}