import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import { filter } from "lodash";
import { Heading, Paragraph } from "grommet";
import ReactTooltip from "react-tooltip";
import CircleQuestion from "grommet/components/icons/base/CircleQuestion";
import SwitchWidget from "../widgets/SwitchWidget";

class TabField extends React.Component {
  constructor(props) {
    super(props);

    let init_tabs = props.properties.filter(
      components => components.name != "analysis_reuse_mode"
    );
    this.options = { ...props.uiSchema["ui:options"] };
    this.view = this.options.view || { vertical: true, sidebarColor: "brand" };
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
          <Box flex={true} direction={this.view.vertical ? "row" : "column"}>
            <Box
              fixed={true}
              size={this.view.vertical ? "small" : "auto"}
              flex={false}
              colorIndex={this.view.sidebarColor || "grey-4"}
              pad={{ between: this.view.vertical ? "none" : "small" }}
              direction={this.view.vertical ? "column" : "row"}
              wrap={true}
            >
              {this.props.properties.map(
                (prop, index) =>
                  prop.name === "analysis_reuse_mode" ? (
                    <Box
                      key={index}
                      pad="small"
                      align="center"
                      separator="bottom"
                    >
                      <Box>
                        <Paragraph>
                          Reuse mode{" "}
                          <CircleQuestion
                            size="xsmall"
                            data-tip
                            data-for="reuseMode"
                          />
                        </Paragraph>
                        <ReactTooltip id="reuseMode" place="right">
                          <Paragraph margin="none" style={{ color: "#fff" }}>
                            Turn this mode on if you want to capture additional
                            information:
                          </Paragraph>
                          <Paragraph margin="none" style={{ color: "#fff" }}>
                            about main and auxiliary measurements, systematic
                            uncertainties,
                          </Paragraph>
                          <Paragraph margin="none" style={{ color: "#fff" }}>
                            background estimates and final state particles
                          </Paragraph>
                        </ReactTooltip>
                        <SwitchWidget
                          {...prop.content.props}
                          id="analysis_reuse_mode"
                        />
                      </Box>
                    </Box>
                  ) : null
              )}
              <Box flex={false}>
                {tabs.map(
                  tab =>
                    tab.name === "analysis_reuse_mode" ? null : (
                      <Box
                        colorIndex={
                          tab.name == this.state.active ? "light-1" : null
                        }
                        key={tab.key ? tab.key : tab.name}
                        pad="small"
                        onClick={this._onTabClick.bind(this, tab)}
                      >
                        <Heading tag="h5" margin="none" size="medium" strong>
                          {tab.title ||
                            tab.content.props.schema.title ||
                            "Untitled"}
                        </Heading>
                      </Box>
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
                  size={this.view.innerTab || "xlarge"}
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
  properties: PropTypes.array
};

export default TabField;
