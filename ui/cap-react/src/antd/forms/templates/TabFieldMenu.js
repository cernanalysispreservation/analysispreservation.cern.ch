import React from "react";
import PropTypes from "prop-types";
import { Menu, Space, Switch, Typography } from "antd";
import { isTabContainsError } from "./utils/tabfield";

const TabFieldMenu = ({
  tabs,
  active,
  analysis_mode,
  showReuseMode,
  analysisChecked,
  setAnalysisChecked,
  setActive,
  formErrors,
  optionsTabs
}) => {
  return (
    <Menu
      mode="inline"
      selectedKeys={[active]}
      style={{ height: "100%", width: "220px" }}
    >
      {analysis_mode.length > 0 &&
        showReuseMode && (
          <Menu.Item key="analysis_reuse_mode">
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
        <Menu.Item
          key={item.name}
          onClick={() => {
            setActive(item.name);
          }}
          danger={isTabContainsError(
            optionsTabs ? item.idsList : item.content.props.idSchema.$id,
            formErrors
          )}
        >
          {item.title || item.content.props.schema.title}
        </Menu.Item>
      ))}
    </Menu>
  );
};

TabFieldMenu.propTypes = {
  formErrors: PropTypes.array,
  setActive: PropTypes.func,
  setActiveLabel: PropTypes.func,
  setAnalysisChecked: PropTypes.func,
  tabs: PropTypes.array,
  active: PropTypes.string,
  analysis_mode: PropTypes.array,
  showReuseMode: PropTypes.bool,
  analysisChecked: PropTypes.bool,
  optionsTabs: PropTypes.object
};

export default TabFieldMenu;
