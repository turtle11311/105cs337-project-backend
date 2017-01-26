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