import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import { filter } from "lodash";
import AnalysisReuseMode from "../components/AnalysisReuseMode";
import ErrorFieldIndicator from "./ErrorFieldIndicator";

class TabField extends React.Component {
  constructor(props) {
    super(props);

    // keep track of every property that is hidden
    this.props.properties.map((item, index) => {
      if (
        this.props.uiSchema &&
        this.props.uiSchema[item.name] &&
        this.props.uiSchema[item.name]["ui:options"] &&
        this.props.uiSchema[item.name]["ui:options"].hidden
      ) {
        this.props.properties.splice(index, 1);
      }
    });

    let init_tabs = props.properties.filter(
      components => components.name != "analysis_reuse_mode"
    );

    this.options = { ...props.uiSchema["ui:options"] };
    this.view = this.options.view || { vertical: true, sidebarColor: "grey-3" };
    let active;
    if (this.options.initTab) active = this.options.initTab;
    else if (this.options.tabs && this.options.tabs.length > 0)
      active = this.options.tabs[0].key;
    else if (init_tabs && init_tabs.length > 0) active = init_tabs[0].name;

    this.state = {
      active
    };

    this._onClick = this._onClick.bind(this);
  }

  _onClick() {
    this.setState({ layerActive: true });
  }

  _onTabClick = tab => {
    this.setState({ active: tab.key ? tab.key : tab.name });
  };

  render() {
    let tabs = this.options.tabs ? this.options.tabs : this.props.properties;
    let active_tab = [];
    let active_tabs_content = [];

    if (this.options.tabs) {
      active_tab = this.options.tabs.filter(
        tab => tab.key == this.state.active
      );

      if (active_tab.length > 0) {
        active_tabs_content = filter(this.props.properties, prop => {
          return (
            active_tab[0].content &&
            active_tab[0].content.indexOf(prop.name) > -1
          );
        });
      }
    } else {
      active_tabs_content = active_tab = this.props.properties.filter(
        prop => prop.name == this.state.active
      );
    }

    return (
      <Box
        flex={true}
        style={{
          display: "grid",
          justifyContent: this.options && this.options.full ? " " : "center"
        }}
      >
        <Box size={this.options && this.options.full ? "full" : "xxlarge"}>
          <Box className="md-column">
            <Box
              fixed="true"
              flex={false}
              colorIndex={this.view.sidebarColor || "grey-4"}
              pad={{ between: this.view.vertical ? "none" : "small" }}
              direction={this.view.vertical ? "column" : "row"}
              wrap={true}
            >
              {this.props.properties.map(
                (prop, index) =>
                  prop.name === "analysis_reuse_mode" ? (
                    <AnalysisReuseMode
                      key={index}
                      innerProps={prop.content.props}
                    />
                  ) : null
              )}
              <Box
                flex={true}
                pad={{ vertical: "none" }}
                size={{ width: { max: "medium" } }}
              >
                {tabs.map(
                  (tab, index) =>
                    tab.name === "analysis_reuse_mode" ? null : (
                      <ErrorFieldIndicator
                        errors={this.props.formContext.ref}
                        id={tab.content.props.idSchema.$id}
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
                        >
                          <Heading tag="h5" margin="none" size="medium" strong>
                            {tab.title ||
                              tab.content.props.schema.title ||
                              "Untitled"}
                          </Heading>
                        </Box>
                      </ErrorFieldIndicator>
                    )
                )}
              </Box>
            </Box>

            <Box flex={true}>
              <Box
                style={{
                  display: "grid",
                  overflow: "auto",
                  padding: "10px",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center"
                }}
              >
                <Box
                  className="rjsf"
                  style={{
                    padding: "10px",
                    overflow: "auto"
                  }}
                  size={{ width: this.view.innerTab || "xlarge" }}
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
