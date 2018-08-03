var socket;

function sendResultsToVim() {
  if (window.location.href.indexOf("scriptdebugger.nl") !== -1) {
    // harvest the output and send back to vim
    var executionLogRows = document.querySelector("#console_fs").querySelectorAll("tr");
    for (var i=0; i<=executionLogRows.length; i++) {
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
  } else {
    socket.send(JSON.stringify({
      "type": "netsuite",
      "message": {
        "description": "Check browser console for results",
        "details":     ""
      }
    }));
  }
}

function waitForSwitchToEditor() {
  if (window.location.href.indexOf("scriptdebugger.nl") !== -1) {
    var switchToEditorButton = document.querySelector('#showeditor');
    if (!switchToEditorButton) {
      setTimeout(waitForSwitchToEditor, 50);
    } else {
      // switch back to editor
      switchToEditorButton.click();

      // send result output back to vim
      sendResultsToVim();
    }
  } else {
    setTimeout(sendResultsToVim, 50);
  }
}

function runScript(scriptBody) {
  if (!socket) {
    return;
  }
  const scriptExec = scriptBody.replace(/\t/g, "\n");

  try {

    if (window.location.href.indexOf("scriptdebugger.nl") !== -1) {
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
      document.querySelector('#mainscript').value = scriptExec;

      // start debugging
      document.querySelector('#debug').click();

      // wait for the UI to update, then hit continue
      setTimeout(function() {
        document.querySelector('#continue').click();

        // wait for the script to finish
        setTimeout(waitForSwitchToEditor, 50);
      }, 250);
    } else {
      eval(scriptExec);
      waitForSwitchToEditor();
    }
  } catch (ex) {
    socket.send(JSON.stringify({
      "type": "netsuite",
      "message": {
        "description": "ERROR",
        "details":     ex.message
      }
    }));
  }
}

function startListening() {
  socket = new WebSocket("ws://127.0.0.1:9001/");

  console.logOriginal('%c -> NetSuite Browserlink enabled', 'color: red; font-weight: bold');
  document.body.style.border = "2px solid red";
}

function stopListening() {
  socket.close();
  socket = null;
  document.body.style.border = "";
}

startListening();
