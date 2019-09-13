import React from "react";
import { storiesOf } from "@storybook/react";

import Box from "grommet/components/Box";
import Grommet from "grommet/components/Grommet";

import objectPath from "object-path";
import Form from "react-jsonschema-form";

// Customized RJSF component ( Grommet )
import FieldTemplate from "../themes/grommet/templates/FieldTemplate";
import ObjectFieldTemplate from "../themes/grommet/templates/ObjectFieldTemplate";
import ArrayFieldTemplate from "../themes/grommet/templates/ArrayFieldTemplate";
import ErrorListTemplate from "../themes/grommet/templates/ErrorListTemplate";

import SectionHeader from "../../components/SectionHeader";

import Widgets from "../themes/grommet/widgets";
import fields from "../themes/grommet/fields";

import store from "../../../../store/configureStore";
import { Provider } from "react-redux";

const errorSchema = {
  title: "Basic Information",
  description:
    "Please provide some information relevant for all parts of the Analysis here",
  type: "object",
  id: "basic_info1",
  required: ["measurement"],
  properties: {
    measurement: {
      type: "string",
      title: "Measurement"
    }
  }
};

const textInputSchema = {
  title: "Basic Information",
  description:
    "Please provide some information relevant for all parts of the Analysis here",
  type: "object",
  id: "basic_info",
  properties: {
    measurement: {
      type: "string",
      title: "Measurement"
    }
  }
};

const _uiSchema = {
  analysisName: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  }
};

const data = {
  analysisName: "",
  lastName: "Norris"
};

const transformErrors = errors => {
  errors.map(error => {
    error.name = error.property;

    if (error.message == "should be string") {
      let errorMessages = objectPath.get(this.props.formData, error.property);
      if (errorMessages == undefined) error.message = "Either edit or remove";
    }

    let objPath = error.property.slice(1).split(".");
    objPath.map((path, index) => {
      let _path = objPath.slice(0, index + 1);
      if (objPath.length == index + 1) return;

      const re = new RegExp("\\[.*?]");
      let isArray = re.test(path);
      if (isArray) {
        let arrayPathname, arrayPath;

        arrayPathname = path.split("[", 1);
        arrayPath = objPath.slice(0, index);
        arrayPath.push(arrayPathname[0]);

        errors.push({ property: "." + arrayPath.join(".") });
      }

      // *** Uncomment following lines if you want to add error
      // *** propagation only for the first level (not nested ones)
      // index == 0 ?
      errors.push({ property: "." + _path.join(".") });
      //: null;
    });
    return error;
  });
  return errors;
};

function _validate(formData, errors) {
  return errors;
}

storiesOf("Forms", module)
  .add("Default", () => (
    <Grommet>
      <Provider store={store}>
        <Box size={{ width: { min: "large" } }} flex={true} wrap={false}>
          <SectionHeader label="Submission Form" />
          <Box align="center" flex={true} wrap={false}>
            <Box
              size={{ width: "xlarge" }}
              pad="large"
              flex={false}
              wrap={false}
            >
              <Form
                style={{ marginBottom: "1em" }}
                schema={textInputSchema}
                FieldTemplate={FieldTemplate}
                ObjectFieldTemplate={ObjectFieldTemplate}
                ArrayFieldTemplate={ArrayFieldTemplate}
                showErrorList={true}
                ErrorList={ErrorListTemplate}
                widgets={Widgets}
                fields={fields}
                uiSchema={_uiSchema}
                liveValidate={false}
                validate={_validate()}
                onError={() => {}}
                transformErrors={transformErrors.bind(this)}
                formData={data}
                onBlur={() => {}}
                onChange={() => {}}
              >
                <span />
              </Form>
            </Box>
          </Box>
        </Box>
      </Provider>
    </Grommet>
  ))
  .add("Error", () => (
    <Grommet>
      <Provider store={store}>
        <Box size={{ width: { min: "large" } }} flex={true} wrap={false}>
          <SectionHeader label="Submission Form" />
          <Box align="center" flex={true} wrap={false}>
            <Box
              size={{ width: "xlarge" }}
              pad="large"
              flex={false}
              wrap={false}
            >
              <Form
                style={{ marginBottom: "1em" }}
                schema={errorSchema}
                FieldTemplate={FieldTemplate}
                ObjectFieldTemplate={ObjectFieldTemplate}
                ArrayFieldTemplate={ArrayFieldTemplate}
                showErrorList={true}
                ErrorList={ErrorListTemplate}
                widgets={Widgets}
                fields={fields}
                uiSchema={_uiSchema}
                liveValidate={true}
                validate={_validate()}
                onError={() => {}}
                transformErrors={transformErrors.bind(this)}
                formData={data}
                onBlur={() => {}}
                onChange={() => {}}
              >
                <span />
              </Form>
            </Box>
          </Box>
        </Box>
      </Provider>
    </Grommet>
  ));
