import React, { Component } from "react";
import PropTypes from "prop-types";

import Form from "../components/drafts/form/Form";
import { Selector } from "./Selector";
import { Editor } from "./Editor";

import { samples } from "./samples";
import { utils } from "./utils";

function shouldRender(comp, nextProps, nextState) {
  const { props, state } = comp;
  return (
    !utils.deepEquals(props, nextProps) || !utils.deepEquals(state, nextState)
  );
}

const toJson = val => JSON.stringify(val, null, 2);

class Playground extends Component {
  constructor(props) {
    super(props);
    const { schema, uiSchema, formData, validate } = samples.Simple;
    this.state = {
      form: false,
      schema,
      uiSchema,
      formData,
      validate,
      theme: "default",
      liveSettings: {
        validate: false,
        disable: false,
        omitExtraData: false,
        liveOmit: false
      },
      shareURL: null,
      themeObj: {}
    };
  }

  componentDidMount() {
    const hash = document.location.hash.match(/#(.*)/);
    if (hash && typeof hash[1] === "string" && hash[1].length > 0) {
      try {
        this.load(JSON.parse(atob(hash[1])));
      } catch (err) {
        alert("Unable to load form setup data.");
      }
    } else {
      this.load(samples.Simple);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  load = data => {
    // Reset the ArrayFieldTemplate whenever you load new data
    const { ArrayFieldTemplate, ObjectFieldTemplate, extraErrors } = data;
    // uiSchema is missing on some examples. Provide a default to
    // clear the field in all cases.
    const { uiSchema = {} } = data;

    const { theme = this.state.theme } = data;
    // const { themes } = this.props;
    // this.onThemeSelected(theme, themes[theme]);

    // force resetting form component instance
    this.setState({ form: false }, () =>
      this.setState({
        ...data,
        form: true,
        ArrayFieldTemplate,
        ObjectFieldTemplate,
        uiSchema,
        extraErrors
      })
    );
  };

  onSchemaEdited = schema => this.setState({ schema, shareURL: null });

  onUISchemaEdited = uiSchema => this.setState({ uiSchema, shareURL: null });

  onFormDataEdited = formData => this.setState({ formData, shareURL: null });

  onExtraErrorsEdited = extraErrors =>
    this.setState({ extraErrors, shareURL: null });

  onThemeSelected = (theme, { stylesheet, theme: themeObj, editor }) => {
    this.setState({
      theme,
      themeObj,
      stylesheet,
      editor: editor ? editor : "default"
    });
  };

  onFormDataChange = ({ formData }) =>
    this.setState({ formData, shareURL: null });

  setLiveSettings = ({ formData }) => this.setState({ liveSettings: formData });

  render() {
    const {
      schema,
      uiSchema,
      formData,
      extraErrors,
      liveSettings,
      validate,
      theme,
      themeObj,
      ArrayFieldTemplate,
      ObjectFieldTemplate,
      transformErrors
    } = this.state;

    const { themes } = this.props;

    // const FormComponent = withTheme(themeObj);

    let templateProps = {};
    if (ArrayFieldTemplate) {
      templateProps.ArrayFieldTemplate = ArrayFieldTemplate;
    }
    if (ObjectFieldTemplate) {
      templateProps.ObjectFieldTemplate = ObjectFieldTemplate;
    }
    if (extraErrors) {
      templateProps.extraErrors = extraErrors;
    }
    return (
      <div className="container-fluid">
        <div className="page-header">
          <h1>Playground</h1>
        </div>
        <div className="row">
          <div className="col-sm-8">
            <Selector onSelected={this.load} themes={themes} />
          </div>
          <div className="col-sm-2">
            <Form
              formRef={{}}
              formData={{}}
              schema={{}}
              uiSchema={{}}
              onChange={e => {
                console.log("-----", e);
              }}
              errors={{}}
            />
          </div>
          <div className="col-sm-7">
            <Editor
              title="JSONSchema"
              code={toJson(schema)}
              onChange={this.onSchemaEdited}
            />
          </div>
          <div className="row">
            <div className="col-sm-6">
              <Editor
                title="UISchema"
                code={toJson(uiSchema)}
                onChange={this.onUISchemaEdited}
              />
            </div>
            <div className="col-sm-6">
              <Editor
                title="formData"
                code={toJson(formData)}
                onChange={this.onFormDataEdited}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Playground.propTypes = {
  name: PropTypes.string
};

export default Playground;
