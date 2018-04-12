var socket = new WebSocket("ws://127.0.0.1:9001/");

function sendResultsToVim() {

  // harvest the output and send back to vim
  var executionLogRows = document.querySelector("#console_fs").querySelectorAll("tr");
  // skip the metrics row
  for (var i=1; i<=executionLogRows.length; i++) {
    var tr = executionLogRows[i];
    if (!tr) {
      continue;
    }
    var tds = tr.querySelectorAll("td");
    var description = tds[0].innerText;
    var details = tds[1].innerText;
    socket.send(JSON.stringify({
      "type": "netsuite",
      "message": {
        "description": description,
        "details":     details
      }
    }));
  }
}

function waitForSwitchToEditor() {
  var switchToEditorButton = document.querySelector('#showeditor');
  if (!switchToEditorButton) {
    setTimeout(waitForSwitchToEditor, 50);
  } else {
    // switch back to editor
    switchToEditorButton.click();

    // send result output back to vim
    sendResultsToVim();
  }
}

function runScript(scriptBody) {
  // intelligently select API version
  if (scriptBody.indexOf('require(') < 0) {
    document.querySelector('#inpt_runtimeversion1').title = '1.0';
    document.querySelector('#inpt_runtimeversion1').value = '1.0';
    document.querySelector('#hddn_runtimeversion1').value = '1.0';
  } else {
    document.querySelector('#inpt_runtimeversion1').title = '2.0';
    document.querySelector('#inpt_runtimeversion1').value = '2.0';
    document.querySelector('#hddn_runtimeversion1').value = '2.0';
  }

  // enter the script text
  document.querySelector('#mainscript').focus();
  document.querySelector('#mainscript').value = scriptBody.replace(/\t/g, "\n");

  // start debugging
  document.querySelector('#debug').click();

  // wait for the UI to update, then hit continue
  setTimeout(function() {
    document.querySelector('#continue').click();

    // wait for the script to finish
    setTimeout(waitForSwitchToEditor, 50);
  }, 250);

}
