import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getPublishedItem } from "../../actions/published";
import DefaultPublished from "./components/Default";
import CmsPublished from "./components/CmsAnalysis";
import LhcbPublished from "./components/LhcbAnalysis";
import AlicePublished from "./components/AliceAnalysis";

export class Published extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { id } = this.props.match.params;
    this.props.getPublishedItem(id);
  }

  _discoverSchema = item => {
    let type;
    return item.$ana_type
      ? item.$ana_type
      : ((type = item.$schema.split("/")),
        type[type.length - 1].replace("-v0.0.1.json", ""));
  };

  render() {
    let item = this.props.item ? this.props.item.metadata : null;
    if (item) {
      let type = this._discoverSchema(item);
      switch (type) {
        case "cms-analysis":
          return <CmsPublished item={item} />;
        case "lhcb":
          return <LhcbPublished item={item} />;
        case "alice-analysis":
          return <AlicePublished item={item} />;
        default:
          return <DefaultPublished item={item} />;
      }
    } else {
      return null;
    }
  }
}

Published.propTypes = {
  error: PropTypes.object,
  getPublishedItem: PropTypes.func,
  item: PropTypes.object,
  match: PropTypes.object
};

function mapStateToProps(state) {
  return {
    item: state.published.getIn(["current_item", "data"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPublishedItem: id => dispatch(getPublishedItem(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Published);
