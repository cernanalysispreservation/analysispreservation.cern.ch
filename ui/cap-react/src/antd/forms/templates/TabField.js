import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { _filterTabs } from "./utils/tabfield";
import { Col, Menu, Row, Space, Switch, Typography } from "antd";

const TabField = ({ uiSchema, properties }) => {
  let options = uiSchema["ui:options"];

  // fetch tabs either from view object or from properties
  let fetched_tabs = options && options.tabs ? options.tabs : properties;

  // check if there is analysis_reuse_mode
  let analysis_mode = fetched_tabs.filter(
    item => item.name === "analysis_reuse_mode"
  );

  let idsList = [];
  let active_tabs_content = [];

  const [active, setActive] = useState("");
  const [analysisChecked, setAnalysisChecked] = useState(
    analysis_mode ? analysis_mode[0].content.props.formData == "true" : false
  );

  // remove components which are meant to be hidden
  // remove from the tab list the analysis_reuse_mode if exists
  let tabs = _filterTabs(options.tabs, idsList, options, properties);
  let active_tab = tabs.filter(prop => prop.name == active);
  if (options.tabs) {
    active_tabs_content = properties.filter(prop => {
      return (
        active_tab[0].content && active_tab[0].content.indexOf(prop.name) > -1
      );
    });
  } else {
    active_tabs_content = active_tab;
  }

  useEffect(() => {
    if (!active) {
      let act = null;
      let actLabel = null;
      let availableTabs = _filterTabs(
        options.tabs,
        idsList,
        options,
        properties
      );
      if (availableTabs.length > 0) {
        if (options.initTab) {
          act = options.initTab;
          actLabel = options.initTab;
        } else {
          act = availableTabs[0].name;
          actLabel =
            availableTabs[0].title ||
            availableTabs[0].content.props.schema.title ||
            active;
        }
      }
      setActive(act);
      // this.state = {
      //   active,
      //   activeLabel,
      //   analysis_mode,
      //   optionTabs: this.options.tabs
      // };
    }
  }, []);

  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gridTemplateRows: "auto",
        overflow: "auto"
      }}
    >
      <div>
        <Menu mode="inline" selectedKeys={[active]} style={{ height: "100%" }}>
          {analysis_mode.length > 0 && (
            <Menu.Item>
              <Space size="large">
                <Typography.Text>Reuse Mode</Typography.Text>
                <Switch
                  disabled={analysis_mode[0].content.props.readonly}
                  checked={analysisChecked}
                  onChange={checked => {
                    analysis_mode[0].content.props.onChange(
                      checked ? "true" : undefined
                    );
                    setAnalysisChecked(checked);
                  }}
                />
              </Space>
            </Menu.Item>
          )}
          {tabs.map(item => (
            <Menu.Item key={item.name} onClick={() => setActive(item.name)}>
              {item.title || item.content.props.schema.title}
            </Menu.Item>
          ))}
        </Menu>
      </div>

      <Row justify="center">
        <Col span={16}>{active_tabs_content.map(item => item.content)}</Col>
      </Row>
    </div>
  );
};

TabField.propTypes = {
  uiSchema: PropTypes.object,
  properties: PropTypes.object
};

export default TabField;
