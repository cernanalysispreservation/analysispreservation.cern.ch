import React from "react";

import classnames from "classnames";

import Tab from "grommet/components/Tab";
import Box from "grommet/components/Box";

const CLASS_ROOT = "grommetux-tab";

class _Tab extends Tab {
  render() {
    const { active, className, id, title, ...props } = this.props;
    delete props.onRequestForActive;
    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--active`]: active
      },
      className
    );

    return (
      <li {...props} className={classes} id={id}>
        <Box
          className={`${CLASS_ROOT}__button`}
          role="tab"
          aria-selected={active}
          onClick={this._onClickTab}
          aria-expanded={active}
        >
          <label className={`${CLASS_ROOT}__label`} htmlFor={id}>
            {title}
          </label>
        </Box>
      </li>
    );
  }
}

export default _Tab;
