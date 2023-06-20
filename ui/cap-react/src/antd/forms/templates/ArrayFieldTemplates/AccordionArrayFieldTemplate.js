import PropTypes from "prop-types";
import { Collapse } from "antd";
import ArrayFieldTemplateItem from "./ArrayFieldTemplateItem";
import ErrorFieldIndicator from "../../error/ErrorFieldIndicator";

const AccordionArrayFieldTemplate = ({ items = [], formContext, id }) => {
  if (items.length < 1) return null;

  return (
    <ErrorFieldIndicator id={id}>
      <Collapse
        expandIconPosition="right"
        items={[
          {
            key: "1",
            label: `${items.length} item(s)`,
            children: items.map((itemProps, idx) => (
              <ArrayFieldTemplateItem
                key={id + idx}
                {...itemProps}
                formContext={formContext}
              />
            )),
          },
        ]}
      />
    </ErrorFieldIndicator>
  );
};

AccordionArrayFieldTemplate.propTypes = {
  items: PropTypes.array,
  formContext: PropTypes.object,
  id: PropTypes.string,
};

export default AccordionArrayFieldTemplate;
