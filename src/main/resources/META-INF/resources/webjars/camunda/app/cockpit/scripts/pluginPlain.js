export default {
    // id for plugin
    id: "",
    // location where plugin goes
    pluginPoint: "cockpit.processInstance.runtime.tab",
    // what to render, specific objects that you can pass into render function to use
    render: (node, { api, processDefinitionId }) => {
      // HTML of the plugin
      node.innerHTML = '';
    },
  };
