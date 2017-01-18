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