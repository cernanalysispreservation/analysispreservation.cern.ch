import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { updateExpandState } from "../../../actions/search";

const ShowMore = ({ children, limit, items, expanded, updateExpandState }) => {
  const [current, setCurrent] = useState([]);
  const [filter] = useState(items.length > limit);

  const showMore = () => {
    setCurrent(items);
    updateExpandState(true);
  };

  const showLess = () => {
    setCurrent(items.slice(0, limit));
    updateExpandState(false);
  };

  useEffect(() => {
    if (expanded) {
      setCurrent(items);
      updateExpandState(true);
    } else {
      setCurrent(items.slice(0, limit));
      updateExpandState(false);
    }
  }, []);

  return children({
    current,
    showMore,
    showLess,
    filter,
    expanded
  });
};

ShowMore.propTypes = {
  children: PropTypes.func,
  items: PropTypes.array,
  limit: PropTypes.number
};

function mapStateToProps(state) {
  return {
    expanded: state.search.get("expanded")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExpandState: val => dispatch(updateExpandState(val))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowMore);
