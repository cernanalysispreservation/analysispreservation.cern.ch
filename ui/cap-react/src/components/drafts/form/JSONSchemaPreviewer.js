import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

// Customized RJSF component ( Grommet )
import FieldTemplate from "./themes/grommet-preview/templates/FieldTemplate";
import ObjectFieldTemplate from "./themes/grommet-preview/templates/ObjectFieldTemplate";
import ArrayFieldTemplate from "./themes/grommet-preview/templates/ArrayFieldTemplate";

import widgets from "./themes/grommet-preview/widgets";
import fields from "./themes/grommet-preview/fields";
import Form from "react-jsonschema-form";

import yaml from "js-yaml";
import AceEditor from "react-ace";

class JSONShemaPreviewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {}
    };
  }

  render() {
    let { general_title, ..._formData = {}} = this.props.formData;

    return (
      <Box flex={true}>
        {
          this.props.schemaType.name && 
          this.props.schemaType.name == "cms-stats-questionnaire" ?
            <AceEditor
              readOnly
              mode="yaml"
              theme="github"
              width="100%"
              name={general_title || "draftPreviewerFormName"}
              value={yaml.safeDump(_formData)}
              editorProps={{ $blockScrolling: true }}
            />
            : this.props.schema ? (
              <Form
                ref={form => {
                  this.form = form;
                }}
                schema={this.props.schema}
                FieldTemplate={FieldTemplate}
                ObjectFieldTemplate={ObjectFieldTemplate}
                ArrayFieldTemplate={ArrayFieldTemplate}
                showErrorList={false}
                widgets={widgets}
                fields={fields}
                uiSchema={this.props.uiSchema ? this.props.uiSchema : {}}
                liveValidate={false}
                noValidate={true}
                onError={() => { }}
                formData={this.props.formData}
                onBlur={() => { }}
                onChange={this.props.onChange}
                onSubmit={this.props.onSubmit}
              >
                {this.props.children}
              </Form>
            ) : null}
      </Box>
    );
  }
}

JSONShemaPreviewer.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
  schemaType: PropTypes.object
};

export default JSONShemaPreviewer;
