import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Anchor, Box, Header, Heading, Label, Menu } from "grommet";

import { withRouter } from "react-router";

class DraftHeader extends React.Component {
  constructor(props) {
    super(props);

    let general_title =
      props.draft && props.draft.general_title
        ? props.draft.general_title
        : "Untitled draft";

    this.state = {
      editTitle: true,
      hoverTitle: false,
      titleValue: general_title
    };
  }

  _focusInput = () => {
    this.setState({ editTitle: !this.state.editTitle });
  };

  _hoverInput = () => {
    this.setState({ hoverTitle: !this.state.hoverTitle });
  };

  _onChange = e => {
    this.setState({ titleValue: e.target.value });
  };

  _onBlur = () => {
    alert("Saving title: " + this.state.titleValue);
    this.setState({
      hoverTitle: !this.state.hoverTitle,
      editTitle: !this.state.editTitle
    });
  };

  render() {
    return (
      <Box flex={false} colorIndex="neutral-1-t">
        {this.props.location.pathname.startsWith("/drafts/create") ? (
          <Box
            flex={false}
            justify="center"
            margin={{ vertical: "small", horizontal: "small" }}
            direction="row"
          >
            New draft
          </Box>
        ) : (
          <Box
            flex={false}
            justify="between"
            margin={{ vertical: "small", horizontal: "small" }}
            direction="row"
          >
            <Box
              flex={false}
              direction="row"
              alignContent="center"
              align="center"
              justify="center"
            >
              {this.state.editTitle
                ? [
                    <Box
                      key="draft-title"
                      onMouseEnter={this._hoverInput}
                      onMouseLeave={this._hoverInput}
                      onClick={this._focusInput}
                      margin={{ right: "small" }}
                      style={{
                        border: this.state.hoverTitle
                          ? "1px solid #fff"
                          : "1px solid transparent",
                        marginLeft: "-5px",
                        paddingLeft: "5px"
                      }}
                    >
                      <strong>{this.state.titleValue}</strong>
                    </Box>
                    // <Edit size="xsmall" onClick={this._focusInput} />
                  ]
                : [
                    <input
                      key="draft-input"
                      onChange={this._onChange}
                      onBlur={this._onBlur}
                      style={{
                        borderRadius: "0",
                        padding: "0 11px",
                        border: "#fff 1px solid"
                      }}
                      value={this.state.titleValue}
                    />
                    // <CheckmarkIcon size="xsmall" onClick={this._focusInput}/>
                  ]}
            </Box>
            <Box flex={true} align="end">
              Analysis Identifier: {this.props.id}
            </Box>
          </Box>
        )}
      </Box>
    );
  }
}

DraftHeader.propTypes = {
  match: PropTypes.object.isRequired,
  draft: PropTypes.object,
  id: PropTypes.string
};

function mapStateToProps(state) {
  return {
    selectedSchema: state.drafts.get("selectedSchema"),
    id: state.drafts.getIn(["current_item", "id"]),
    draft: state.drafts.getIn(["current_item", "data"])
  };
}

export default withRouter(connect(mapStateToProps)(DraftHeader));
