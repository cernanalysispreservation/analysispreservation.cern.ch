import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { AiOutlineWarning } from "react-icons/ai";
import Box from "grommet/components/Box";

const Wrapper = styled.div`
  background: rgb(254, 247, 225);
  border-radius: 3px;
  padding: 10px;
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  padding: 5px;
  margin: 0 3px;
  line-height: 150%;
  letter-spacing: 0.5px;
`;

const Notification = ({ text }) => {
  return (
    <Wrapper>
      <Box style={{ padding: "5px" }}>
        <AiOutlineWarning size={25} color="rgb(232,134,34)" />
      </Box>
      <Box flex>
        <Text>{text}</Text>
      </Box>
    </Wrapper>
  );
};

Notification.propTypes = {
  text: PropTypes.string
};

export default Notification;
