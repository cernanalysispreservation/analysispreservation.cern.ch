import React from "react";

import classnames from "classnames";

import AccordionPanel from "grommet/components/AccordionPanel";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Collapsible from "grommet/components/Collapsible";
import CaretNextIcon from "grommet/components/icons/base/CaretNext";
import { Heading } from "grommet";

const CLASS_ROOT = "grommetux-accordion-panel";

class _AccordionPanel extends AccordionPanel {
  render() {
    const {
      a11yTitle,
      active,
      animate,
      className,
      children,
      heading,
      headingColor,
      pad
    } = this.props;
    const { intl } = this.context;

    const classes = classnames(CLASS_ROOT, className, {
      [`${CLASS_ROOT}--active`]: active
    });

    const tabContentTitle = "";

    return (
      <div>
        <Box
          className={classes}
          margin="none"
          separator="bottom"
          direction="column"
          pad="none"
          aria-expanded={active}
          aria-selected={active}
          role="tab"
          aria-label={a11yTitle || heading}
        >
          <Box onClick={this._onClickTab}>
            <Box
              pad="small"
              direction="row"
              colorIndex={headingColor || "neutral-1"}
              justify="between"
              align="center"
              responsive={false}
              className={`${CLASS_ROOT}__header`}
            >
              <Heading tag="h6" margin="none">
                {heading}
              </Heading>
              <CaretNextIcon className={`${CLASS_ROOT}__control`} />
            </Box>
          </Box>
        </Box>
        <Collapsible
          aria-label={tabContentTitle}
          role="tabpanel"
          active={active}
          animate={animate}
          pad={pad}
        >
          {children}
        </Collapsible>
      </div>
    );
  }
}

export default _AccordionPanel;
