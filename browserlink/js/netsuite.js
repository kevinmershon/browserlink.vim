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
  document.querySelector('#mainscript').focus();
  document.querySelector('#mainscript').value = scriptBody;

  document.querySelector('#debug').click();
  setTimeout(function() {
    document.querySelector('#continue').click();

    function waitForSwitchToEditor() {
      var switchToEditorButton = document.querySelector('#showeditor');
      if (!switchToEditorButton) {
        setTimeout(waitForSwitchToEditor, 50);
      } else {
        switchToEditorButton.click();
      }
    }
    setTimeout(waitForSwitchToEditor, 50);

  }, 150);

}
