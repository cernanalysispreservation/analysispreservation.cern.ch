import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography, Row, Col } from "antd";
import "./CreateForm.less";

const CreateForm = props => {
  const [depositGroup, setDepositGroup] = useState(null);

  useEffect(
    () => {
      if (depositGroup && props.updateModal)
        props.updateModal({ name: depositGroup });
    },
    [depositGroup]
  );

  return (
    <div className="__CreateModal__">
      <Typography.Title level={5}>
        Select the content type you want to create and start preserving!
      </Typography.Title>

      <Row gutter={{ xs: 4, md: 6, lg: 8 }}>
        {props.contentTypes &&
          props.contentTypes.map(type => (
            <Col
              span={12}
              key={type.get("deposit_group")}
              onClick={() => setDepositGroup(type.get("deposit_group"))}
            >
              <div
                className={
                  type.get("deposit_group") === depositGroup
                    ? "selected-item select-item"
                    : "select-item"
                }
              >
                {type.get("name")}
              </div>
            </Col>
          ))}
      </Row>
    </div>
  );
};

CreateForm.propTypes = {};

export default CreateForm;
