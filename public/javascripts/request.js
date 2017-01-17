function op() {
  let method = $('input#reqmethod')[0].value;
  let url = $('input#requrl')[0].value;
  let data = JSON.parse($('textarea#reqdata')[0].value);
  $.ajax({
    url: url,
    method: method,
    data: data,
    dataType: 'json'
  });
}