import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { isTabContainsError, _filterTabs } from "./utils/tabfield";
import {
  Col,
  Layout,
  Row,
  Space,
  Switch,
  Typography,
  Grid,
  Select,
} from "antd";
import { connect } from "react-redux";

import TabFieldMenu from "./TabFieldMenu";

const TabField = ({ uiSchema, properties, formErrors }) => {
  let options = uiSchema["ui:options"] || {};

  // fetch tabs either from view object or from properties
  let fetched_tabs = options.tabs ? options.tabs : properties;

  // check if there is analysis_reuse_mode
  let analysis_mode = fetched_tabs.filter(
    item => item.name === "analysis_reuse_mode"
  );

  let idsList = [];
  let active_tabs_content = [];

  const [active, setActive] = useState("");
  const [analysisChecked, setAnalysisChecked] = useState(
    analysis_mode.length > 0
      ? analysis_mode[0].content.props.formData == "true"
      : false
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
      let availableTabs = _filterTabs(
        options.tabs,
        idsList,
        options,
        properties
      );
      if (availableTabs.length > 0) {
        if (options.initTab) {
          act = options.initTab;
        } else {
          act = availableTabs[0].name;
        }
      }
      setActive(act);
    }
  }, []);

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  return (
    <Layout style={{ height: "100%", padding: 0 }}>
      {screens.md ? (
        <Layout.Sider style={{ height: "100%" }}>
          <TabFieldMenu
            analysisChecked={analysisChecked}
            analysis_mode={analysis_mode}
            tabs={tabs}
            active={active}
            showReuseMode
            setActive={setActive}
            formErrors={formErrors}
            setAnalysisChecked={setAnalysisChecked}
            optionsTabs={options.tabs}
          />
        </Layout.Sider>
      ) : (
        <Row
          justify="center"
          style={{ padding: "10px", background: "#fff", marginTop: "5px" }}
        >
          <Space direction="vertical" size="middle">
            {analysis_mode.length > 0 && (
              <Space>
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
            )}
            <Select
              value={active}
              onChange={val => setActive(val)}
              style={{ width: 220 }}
            >
              {tabs.map(item => (
                <Select.Option
                  value={item.name}
                  key={item.name}
                  className={
                    isTabContainsError(
                      item.content.props.idSchema.$id,
                      formErrors
                    ) && "ant-select-item-error"
                  }
                >
                  {item.title || item.content.props.schema.title}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Row>
      )}

      <Layout.Content
        style={{ height: "100%", overflowX: "hidden", paddingBottom: "24px" }}
      >
        <Row justify="center">
          <Col span={16} style={{ padding: "10px 0" }}>
            {active_tabs_content.map(item => item.content)}
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

TabField.propTypes = {
  uiSchema: PropTypes.object,
  properties: PropTypes.object,
  formErrors: PropTypes.object,
};

const mapStateToProps = state => ({
  formErrors: state.draftItem.get("formErrors"),
});

export default connect(mapStateToProps, null)(TabField);
