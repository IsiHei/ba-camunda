export default {
    // id for plugin
    id: "deleteProcess",
    // location where plugin goes
    pluginPoint: "cockpit.processDefinition.runtime.action",
    // what to render, specific objects that you can pass into render function to use
    render: (node, { api, processDefinitionId }) => {
      // create the actual button with an image inside + hard-wired styling
      node.innerHTML = `<button class="btn btn-default action-button" style="width: 40px; margin-top: 5px;"><img src="../scripts/delete.png" width="16"/></button>`;
      // onclick function for our button
      node.onclick = function() {
        fetch(api.engineApi + "/process-definition/" + processDefinitionId  + "?cascade=true", {
          method: 'delete',
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": api.CSRFToken,
          }
        }).then(async (res) => {
          // Go to process instance page
          window.location.href = "http://localhost:8080/camunda/app/cockpit/default/#/processes";
        });
      }
    },
  };