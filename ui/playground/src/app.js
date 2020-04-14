import React, { Component } from "react";
import PropTypes from "prop-types";

import Form from "cap-react/src/components/drafts/form/Form";
import { Selector } from "./Selector";
import { Editor } from "./Editor";
import { Box, Heading, CheckBox } from "grommet";
import { samples } from "./samples";
import { utils } from "./utils";
import { FaMoon, FaSun } from "react-icons/fa";

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
      liveValidate: false,
      shareURL: null,
      themeObj: {},
      toggle: false
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

  toggleUpdate = () => {
    this.setState({
      toggle: !this.state.toggle
    });
  };

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

    // const { themes } = this.props;

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
      <Box full colorIndex={this.state.toggle ? "grey-4-a" : "light-1"}>
        <Box align="center">
          <Heading>Playground</Heading>
        </Box>
        <Box
          margin={{ vertical: "medium" }}
          justify="between"
          direction="row"
          pad={{ horizontal: "medium" }}
        >
          <Box>
            <CheckBox
              label="Live Validate"
              onClick={() =>
                this.setState({ liveValidate: !this.state.liveValidate })
              }
              checked={this.state.liveValidate}
            />
          </Box>
          <CheckBox
            label={this.state.toggle ? <FaMoon /> : <FaSun />}
            onClick={this.toggleUpdate}
            toggle={true}
            checked={this.state.toggle}
          />
        </Box>
        <Box>
          <Selector onSelected={this.load} />
        </Box>
        <Box
          flex
          direction="row"
          pad={{ between: "small" }}
          margin={{ top: "large" }}
        >
          <Box flex>
            <Box flex direction="row">
              <Box flex>
                <Editor
                  dark={this.state.toggle}
                  title="JSONSchema"
                  code={toJson(schema)}
                  onChange={this.onSchemaEdited}
                />
              </Box>
              <Box flex>
                <Editor
                  dark={this.state.toggle}
                  title="UISchema"
                  code={toJson(uiSchema)}
                  onChange={this.onUISchemaEdited}
                />
              </Box>
            </Box>
            <Box flex>
              <Editor
                dark={this.state.toggle}
                title="FormData"
                code={toJson(formData)}
                onChange={this.onFormDataEdited}
              />
            </Box>
          </Box>
          <Box flex pad="large" separator="all">
            <Form
              formRef={{}}
              formData={formData}
              schema={schema}
              uiSchema={uiSchema}
              liveValidate={this.state.liveValidate}
              onChange={this.onFormDataChange}
              errors={{}}
            />
          </Box>
        </Box>
      </Box>
    );
  }
}

Playground.propTypes = {
  name: PropTypes.string
};

export default Playground;
