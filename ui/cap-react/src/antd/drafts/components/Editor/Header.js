import PropTypes from "prop-types";
import { Button, Radio, Row, notification } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { canEdit } from "../../utils/permissions";

const Header = ({
  schemaErrors,
  mode = "edit",
  updateMode,
  loading,
  formErrorsChange,
  status,
  updateDraft,
  formData,
  draft_id,
  editPublished,
  draft,
  formRef,
  canUpdate,
  canAdmin,
}) => {
  if (schemaErrors.length > 0) return null;

  const _validateFormData = () => {
    // TOFIX maybe fetch formData from store instead of ref
    const formData = formRef.current ? formRef.current.props.formData : null;

    const { errors = [], errorSchema } = formRef.current.validate(formData);

    formRef.current.submit();

    if (errors.length > 0) {
      notification.error({
        message: "Form could not be submitted",
        description: "Make sure all the fields are properly filled in",
      });

      return { errorFlag: errors.length > 0, errorSchema };
    }

    // remove the 'general_title' from the form validation
    // since we tag the formData as empty if other than
    // ['general_title'] fields are missing

    // we use Object.assign since we want to remove primitive type
    // otherwise the swallow copy will not work
    const formDataWithoutGeneralTitle = Object.assign({}, formData);
    delete formDataWithoutGeneralTitle.general_title;

    // if the form is empty display warning and return false
    // if not save it
    if (_checkIfEmpty(formDataWithoutGeneralTitle)) {
      notification.warning({
        message: "Form is empty",
        description: "Please add some content first, and try saving again",
      });

      return { errorFlag: true, errorSchema: [] };
    } else {
      return { errorFlag: false, errorSchema: [] };
    }
  };

  //checks if the formData Object is an empty Object
  // by going through the data values and calling the isObjectEmpty for each of them
  const _checkIfEmpty = data => {
    let emptyValuesArray = [];
    Object.values(data).map(item => {
      isObjectEmpty(item, emptyValuesArray);
    });
    return emptyValuesArray.length === 0;
  };

  // itertate through object values
  // if the value is not Object it calls isEmptyValues
  // if the values is an Object then recursive calls
  const isObjectEmpty = (obj, arr) => {
    if (typeof obj !== "object") {
      isEmptyValues(obj) ? null : arr.push(obj);
    } else {
      obj &&
        Object.values(obj).length > 0 &&
        Object.values(obj).map(item => {
          let checkedValue;
          if (typeof item !== "object") {
            checkedValue = isEmptyValues(item);
          } else {
            checkedValue = isObjectEmpty(item, arr);
          }

          if (checkedValue === false) {
            arr.push(item);
          }
          return checkedValue;
        });
    }
  };

  // checks if the value is empty undefined or null
  const isEmptyValues = value => {
    if (typeof value === "string") {
      return value.trim().length === 0;
    }
    if (value === undefined || value === null) {
      return true;
    }

    return value.length === 0;
  };

  const _toErrorList = (errorSchema, fieldName = "root") => {
    // XXX: We should transform fieldName as a full field path string.
    let errorList = [];
    if ("__errors" in errorSchema) {
      errorList = errorList.concat(
        errorSchema.__errors.map(() => {
          return `${fieldName}`;
        })
      );
    }
    return Object.keys(errorSchema).reduce((acc, key) => {
      if (key !== "__errors") {
        acc = acc.concat(_toErrorList(errorSchema[key], fieldName + "_" + key));
      }
      return acc;
    }, errorList);
  };
  const _saveData = () => {
    let { errorFlag, errorSchema = [] } = _validateFormData();

    let _errorData = _toErrorList(errorSchema);

    // Use timeout to fire action on the next tick
    setTimeout(() => formErrorsChange(_errorData), 1);

    if (!errorFlag) {
      if (status == "draft") {
        updateDraft(formData, draft_id).finally(() => {
          let { errorSchema } = _validateFormData();
          let _errorData = _toErrorList(errorSchema);
          formErrorsChange(_errorData);
        });
      } else if (status == "published")
        editPublished(
          { ...formData, $schema: draft.$schema },
          draft_id
        ).finally(() => {
          let { errorSchema } = _validateFormData();
          let _errorData = _toErrorList(errorSchema);
          formErrorsChange(_errorData);
        });
    }
  };

  return (
    <Row
      justify="space-between"
      style={{
        padding: "10px",
        background: "#fff",
      }}
    >
      <Radio.Group
        defaultValue={mode}
        buttonStyle="solid"
        onChange={e => updateMode(e.target.value)}
      >
        <Radio.Button value="edit">Edit</Radio.Button>
        <Radio.Button value="preview">Preview</Radio.Button>
      </Radio.Group>
      <Button
        icon={<SaveOutlined />}
        type="primary"
        disabled={mode != "edit" || !canEdit(canAdmin, canUpdate)}
        loading={loading}
        onClick={_saveData}
      >
        Save
      </Button>
    </Row>
  );
};

Header.propTypes = {
  schemaErrors: PropTypes.array,
  mode: PropTypes.string,
  loading: PropTypes.bool,
  formErrorsChange: PropTypes.func,
  status: PropTypes.string,
  updateDraft: PropTypes.func,
  updateMode: PropTypes.func,
  formData: PropTypes.object,
  draft_id: PropTypes.string,
  editPublished: PropTypes.func,
  draft: PropTypes.object,
  formRef: PropTypes.object,
  canAdmin: PropTypes.bool,
  canUpdate: PropTypes.bool,
};

export default Header;
