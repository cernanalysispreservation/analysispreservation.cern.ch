import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

import { BsFillCircleFill } from "react-icons/bs";

const ReviewOptions = props => {
  const options = [
    {
      type: "approved",
      title: "Approve",
      description: "Submit feedback and approve the published version"
    },
    {
      type: "request_changes",
      title: "Request Changes",
      description:
        "Submit feedback and request changes for the published version"
    },
    {
      type: "declined",
      title: "Decline",
      description: "Submit feedback and decline the published version"
    }
  ];
  return options.map(item => (
    <Box
      colorIndex="light-1"
      onClick={() => props.updateReviewType(item.type)}
      flex
      data-cy={`review-type-${item.type}`}
      key={item.type}
      wrap={false}
      style={{
        background: props.reviewType === item.type ? "#E6F7FF" : "#f5f5f5"
      }}
    >
      <Box
        pad="small"
        align="center"
        justify="between"
        direction="row"
        responsive={false}
      >
        <Heading tag="h4" margin="none">
          {item.title}
        </Heading>

        {props.reviewType === item.type && (
          <BsFillCircleFill color="#006A93" size={15} />
        )}
      </Box>
      <Box pad="small">
        <Box>{item.description}</Box>
      </Box>
    </Box>
  ));
};

ReviewOptions.propTypes = {
  options: PropTypes.array
};

export default ReviewOptions;
