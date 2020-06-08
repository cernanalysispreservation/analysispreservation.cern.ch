import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import { filter } from "lodash";
import AnalysisReuseMode from "../components/AnalysisReuseMode";
import ErrorFieldIndicator from "./ErrorFieldIndicator";
import Select from "react-select";

class TabField extends React.Component {
  constructor(props) {
    super(props);

    // fetch uiOptions
    this.options = { ...props.uiSchema["ui:options"] };

    // fetch tabs either from view object or from properties
    let fetched_tabs = this.options.tabs
      ? this.options.tabs
      : this.props.properties;

    // check if there is analysis_reuse_mode
    let analysis_mode = fetched_tabs.filter(
      item => item.name === "analysis_reuse_mode"
    );

    // remove components which are meant to be hidden
    // remove from the tab list the analysis_reuse_mode if exists
    let availableTabs = this._filterTabs(this.options.tabs, []);

    // fetch view options from schema or default values
    this.view = this.options.view || { vertical: true, sidebarColor: "grey-3" };

    // decide which tab will be active when mount
    let active;
    let activeLabel;

    if (this.options.initTab) {
      active = this.options.initTab;
      activeLabel = this.options.initTab;
    } else {
      active = availableTabs[0].name;
      activeLabel =
        availableTabs[0].title ||
        availableTabs[0].content.props.schema.title ||
        active;
    }

    this.state = {
      active,
      activeLabel,
      analysis_mode,
      optionTabs: this.options.tabs
    };

    this._onClick = this._onClick.bind(this);
  }

  _onClick() {
    this.setState({ layerActive: true });
  }

  _onTabClick = tab => {
    this.setState({
      active: tab.name,
      activeLabel: tab.title || tab.content.props.schema.title || tab.name
    });
  };

  _checkIfHidden = name => {
    return (
      this.props.uiSchema &&
      this.props.uiSchema[name] &&
      this.props.uiSchema[name]["ui:options"] &&
      this.props.uiSchema[name]["ui:options"].hidden
    );
  };

  _filterTabs = (tabs, idsList) => {
    if (tabs) {
      this.options.tabs.map(tab => {
        tab.idsList = [];
        this.props.properties.map(item => {
          if (tab.content.includes(item.name)) {
            idsList.push(item.content.props.idSchema.$id);
            tab.idsList.push(item.content.props.idSchema.$id);
          }
        });
      });
      return this.options.tabs;
    }
    return this.props.properties.filter(
      item =>
        !this._checkIfHidden(item.name) && item.name !== "analysis_reuse_mode"
    );
  };
  updateValueOnClick = tab => {
    this.setState({ active: tab.value, activeLabel: tab.label });
  };

  render() {
    let idsList = [];
    let active_tabs_content = [];

    let tabs = this._filterTabs(this.options.tabs, idsList);
    let active_tab = tabs.filter(prop => prop.name == this.state.active);

    if (this.options.tabs) {
      active_tabs_content = filter(this.props.properties, prop => {
        return (
          active_tab[0].content && active_tab[0].content.indexOf(prop.name) > -1
        );
      });
    } else {
      active_tabs_content = active_tab;
    }

    return (
      <Box
        flex={true}
        style={{
          display: "grid"
        }}
      >
        <Box>
          <Box className="md-column">
            <Box
              fixed="true"
              colorIndex={this.view.sidebarColor || "grey-4"}
              pad={{ between: this.view.vertical ? "none" : "small" }}
              className="small-row-large-column"
              align="center"
              id="list"
            >
              {this.state.analysis_mode.length > 0 ? (
                <AnalysisReuseMode
                  innerProps={this.state.analysis_mode[0].content.props}
                />
              ) : null}

              <Box
                className="tabs-select-menu"
                colorIndex={this.view.sidebarColor || "grey-4"}
              >
                <Box pad="small">
                  <Select
                    id="tabs-select-component"
                    className="select-menu"
                    options={tabs.map(tab => {
                      return {
                        value: tab.name,
                        label:
                          tab.title ||
                          tab.content.props.schema.title ||
                          "Untitled"
                      };
                    })}
                    onChange={this.updateValueOnClick}
                    value={{
                      label: this.state.activeLabel,
                      value: this.state.active
                    }}
                  />
                </Box>
              </Box>
              <Box className="tabs-list">
                <Box pad={{ vertical: "none" }} className="tabs-list-items">
                  {tabs.map((tab, index) => (
                    <ErrorFieldIndicator
                      errors={this.props.formContext.ref}
                      id={
                        this.state.optionTabs
                          ? tab.idsList
                          : tab.content.props.idSchema.$id
                      }
                      properties={this.props.properties}
                      tab={true}
                      key={index}
                    >
                      <Box
                        colorIndex={
                          tab.name == this.state.active ? "light-1" : null
                        }
                        key={index}
                        pad="small"
                        onClick={this._onTabClick.bind(this, tab)}
                        id="item"
                      >
                        <Heading tag="h5" margin="none" size="medium" strong>
                          {tab.title ||
                            tab.content.props.schema.title ||
                            "Untitled"}
                        </Heading>
                      </Box>
                    </ErrorFieldIndicator>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box flex={true}>
              <Box
                style={{
                  display: "grid",
                  padding: "10px",
                  width: "100%"
                }}
                className="justify-large  tab-scroll"
              >
                <Box
                  className="rjsf xlarge_box"
                  style={{
                    padding: "10px"
                  }}
                >
                  {active_tabs_content.map(item => item.content)}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

TabField.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.array,
  formContext: PropTypes.object
};

export default TabField;
