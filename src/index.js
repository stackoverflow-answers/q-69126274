console.log("App Running!");

window.renderApp = (rootId) => {
  console.log("Child render is running in", rootId);
  document.getElementById("root").innerHTML = "<h2>Child Renders</h2>";
};

console.log(window.renderApp);
