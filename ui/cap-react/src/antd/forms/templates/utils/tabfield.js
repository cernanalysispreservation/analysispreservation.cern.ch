export const _filterTabs = (tabs, idsList, options, properties) => {
  if (tabs) {
    options.tabs.map(tab => {
      tab.idsList = [];
      properties.map(item => {
        if (tab.content.includes(item.name)) {
          idsList.push(item.content.props.idSchema.$id);
          tab.idsList.push(item.content.props.idSchema.$id);
        }
      });
    });
    return options.tabs;
  }
  return properties.filter(
    item => !_checkIfHidden(item.name) && item.name !== "analysis_reuse_mode"
  );
};

const _checkIfHidden = (name, uiSchema) => {
  return (
    uiSchema &&
    uiSchema[name] &&
    uiSchema[name]["ui:options"] &&
    uiSchema[name]["ui:options"].hidden
  );
};
