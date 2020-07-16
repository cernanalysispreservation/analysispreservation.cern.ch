import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  padding: 10px;
  &:hover {
    background: #f5f5f5;
    cursor: pointer;
  }
`;

const timeOptions = {
  day: "numeric",
  month: "long",
  year: "numeric"
};

const Div = styled.div`
  ${({ strong }) =>
    strong &&
    css`
      font-weight: 600;
    `};
  ${({ fade }) =>
    fade &&
    css`
      opacity: 0.7;
    `};
`;

const ImportDataFieldSelectComponent = props => {
  const { data } = props;

  return (
    <Wrapper onClick={() => props.selectOption(data)}>
      <Div
        style={{
          textAlign: data.noSelection && "center"
        }}
        strong
      >
        {data.label}
      </Div>
      <Div fade>{data.id}</Div>
      <Div fade>
        {data.created &&
          new Date(data.created).toLocaleString("en-GB", timeOptions)}
      </Div>
    </Wrapper>
  );
};

ImportDataFieldSelectComponent.propTypes = {
  data: PropTypes.object,
  selectOption: PropTypes.func
};

export default ImportDataFieldSelectComponent;
