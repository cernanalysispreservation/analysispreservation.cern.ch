import React from "react";
import PropTypes from "prop-types";
import { Collapse } from "antd";
import ArrayFieldTemplateItem from "./ArrayFieldTemplateItem";

const AccordionArrayFieldTemplate = ({ items = [], formContext }) => {
  if (items.length < 1) return null;
  return (
    <Collapse expandIconPosition="right">
      <Collapse.Panel header={`${items.length} item(s)`} key="1">
        {items.map(itemProps => (
          <ArrayFieldTemplateItem {...itemProps} formContext={formContext} />
        ))}
      </Collapse.Panel>
    </Collapse>
  );
};

AccordionArrayFieldTemplate.propTypes = {};

export default AccordionArrayFieldTemplate;
