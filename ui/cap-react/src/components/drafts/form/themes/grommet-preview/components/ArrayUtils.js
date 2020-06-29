import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";

import FormUpIcon from "grommet/components/icons/base/FormUp";
import FormDownIcon from "grommet/components/icons/base/FormDown";
import { AiOutlineDelete } from "react-icons/ai";

let ArrayUtils = function(props) {
  const {
    hasRemove,
    hasMoveDown,
    hasMoveUp,
    onDropIndexClick,
    onReorderClick,
    index
  } = props;
  return (
    <Box direction="row" justify="between">
      <Button
        margin="none"
        pad="none"
        onClick={hasRemove ? onDropIndexClick(index) : null}
        icon={<AiOutlineDelete size={18} />}
      />
      {this.props.reorder ? (
        <React.Fragment>
          <Button
            onClick={hasMoveDown ? onReorderClick(index, index + 1) : null}
            icon={<FormDownIcon margin="none" pad="none" />}
          />
          <Button
            onClick={hasMoveUp ? onReorderClick(index, index - 1) : null}
            icon={<FormUpIcon margin="none" pad="none" />}
          />
        </React.Fragment>
      ) : null}
    </Box>
  );
};

ArrayUtils.propTypes = {
  hasRemove: PropTypes.bool,
  hasMoveDown: PropTypes.bool,
  hasMoveUp: PropTypes.bool,
  onDropIndexClick: PropTypes.func,
  onReorderClick: PropTypes.func,
  index: PropTypes.string
};

export default ArrayUtils;
