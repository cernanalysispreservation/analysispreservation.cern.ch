import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Jsondiffpatch from 'jsondiffpatch/dist/jsondiffpatch.umd.js';

import 'jsondiffpatch/dist/formatters-styles/html.css';
import 'jsondiffpatch/dist/formatters-styles/annotated.css';

const formatters = Jsondiffpatch.formatters;

class JsonDiff extends Component {
  static propTypes = {
    right: PropTypes.any,
    left: PropTypes.any,
    show: PropTypes.bool,
    annotated: PropTypes.bool,
    tips: PropTypes.string,
    objectHash: PropTypes.func,
  };
  render() {
    const { right, left, show = true, annotated = false, tips, objectHash } = this.props;
    const delta = Jsondiffpatch.create({ objectHash }).diff(left, right);
    const html = annotated
      ? formatters.annotated.format(delta)
      : formatters.html.format(delta, left);
    show ? formatters.html.showUnchanged() : formatters.html.hideUnchanged();

    return html ? (
      <div dangerouslySetInnerHTML={{ __html: html }} />
    ) : (
      <p style={{ fontSize: 12, color: '#999' }}>{tips || 'Both objects are identical.'}</p>
      );
  }
}
export default JsonDiff;