import PropTypes from "prop-types";
import Form from "../../forms/Form";
import { transformSchema } from "../../partials/Utils/schema";
import ObjectFieldTemplate from "../formComponents/ObjectFieldTemplate";
import ArrayFieldTemplate from "../formComponents/ArrayFieldTemplate";
import FieldTemplate from "../formComponents/FieldTemplate";
import { _validate } from "../utils";

const SchemaTree = ({ schema, uiSchema }) => {
  return (
    <Form
      schema={transformSchema(schema.toJS())}
      uiSchema={uiSchema.toJS()}
      formData={{}}
      ObjectFieldTemplate={ObjectFieldTemplate}
      ArrayFieldTemplate={ArrayFieldTemplate}
      FieldTemplate={FieldTemplate}
      onChange={() => {}}
      validate={_validate}
      liveValidate
      formContext={{ schema: [], uiSchema: [] }}
    />
  );
};

SchemaTree.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
};

export default SchemaTree;
