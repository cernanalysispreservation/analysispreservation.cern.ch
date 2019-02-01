const thebeConfig = `
{
  bootstrap: true,
  binderOptions: {
    repo: "lukasheinrich/nbinteract-pyhf",
    ref: "master"
  },
  kernelOptions: {
    name: "python3"
  }
}
`;

const json_url = "";

const htmlContent = template`
<html>
  <head>
    <meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <title>Thebe Lab examples</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">

    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js"></script>

    <!-- Configure and load Thebe !-->
    <script type="text/x-thebe-config">${thebeConfig}</script>
    <script type="text/javascript" src="https://unpkg.com/thebelab@^0.3.0"></script>
  </head>
  <body>
      <div data-executable="true" data-language="python">
      <!-- Python code to run !-->

import requests, pyhfviz

wspace = requests.get('${json_url}').json()

pyhfviz.viz_likelihood(wspace)

      <!-- Python code to run !-->
      </div>
  </body>
  <script type="">
    $( document ).ready(function() {
      $(".thebelab-run-button")[0].click();
      $(".thebelab-button").hide();
      $(".thebelab-button").hide();
      $(".thebelab-input").hide();
    });
  </script>
</html>`;

function template(strings, ...keys) {
  return function(json_url) {
    return strings[0] + keys[0] + strings[1] + json_url + strings[2];
  };
}

export default htmlContent;
