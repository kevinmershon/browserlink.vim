function runScript(scriptBody) {
  // intelligently select API version
  if (scriptBody.indexOf('require(') < 0) {
    document.querySelector('#inpt_runtimeversion1').title = '1.0';
    document.querySelector('#inpt_runtimeversion1').value = '1.0';
  } else {
    document.querySelector('#inpt_runtimeversion1').title = '2.0';
    document.querySelector('#inpt_runtimeversion1').value = '2.0';
  }
  document.querySelector('#mainscript').value = scriptBody;

  window.debugScript('adhoc');
  setTimeout(function() {
    window.debugCommand('go');
  }, 50);
}
