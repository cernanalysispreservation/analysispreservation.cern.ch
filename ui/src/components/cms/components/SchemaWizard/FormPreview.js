import React from "react";
import { PropTypes } from "prop-types";

import Box from "grommet/components/Box";
import { Header } from "grommet";
import CleanForm from "../../../drafts/form/CleanForm";

class FormPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: "a" };
  }

  a = () => (
    <Box
      colorIndex="brand"
      flex="grow"
      pad="large"
      justify="center"
      align="center"
    >
      <Box colorIndex="accent-1" flex={false} size={{ width: "medium" }}>
        1
      </Box>
      <Box colorIndex="accent-2" flex={false} size={{ width: "medium" }}>
        2
      </Box>
      <Box colorIndex="accent-3" flex={false} size={{ width: "medium" }}>
        3
      </Box>
    </Box>
  );
  b = () => (
    <Box
      colorIndex="brand"
      flex={false}
      pad="large"
      wrap={true}
      direction="row"
    >
      <Box colorIndex="accent-1" flex="shrink" basis="1/2">
        <Box colorIndex="accent-1" flex="shrink" size={{ height: "large" }}>
          1
        </Box>
      </Box>
      <Box colorIndex="accent-2" flex={"shrink"} basis="1/2">
        2
      </Box>
      <Box colorIndex="accent-3" flex={"shrink"} basis="1/2">
        3
      </Box>
      <Box colorIndex="accent-4" flex={"shrink"} basis="1/2">
        4
      </Box>
      <Box colorIndex="accent-5" flex={"shrink"} basis="1/2">
        5
      </Box>
    </Box>
  );
  c = () => (
    <Box
      colorIndex="brand"
      flex={false}
      pad="large"
      wrap={true}
      direction="row"
    >
      <Box colorIndex="accent-1" flex={true} basis="1/2">
        <Box colorIndex="accent-1" flex={false} size={{ height: "large" }}>
          1
        </Box>
      </Box>
      <Box colorIndex="accent-2" flex={false} basis="1/2">
        2
      </Box>
      <Box colorIndex="accent-3" flex={false} basis="1/4">
        3
      </Box>
      <Box colorIndex="accent-4" flex={false} basis="1/4">
        4
      </Box>
      <Box colorIndex="accent-5" flex={false} basis="1/4">
        5
      </Box>
      <Box colorIndex="accent-5" flex={false} basis="1/4">
        6
      </Box>
    </Box>
  );

  renderLayout = () => {
    switch (this.state.active) {
      case "a":
        return this.a();
      case "b":
        return this.b();
      case "c":
        return this.c();
      default:
        return this.a();
    }
  };
  render() {
    return (
      // <Box flex={true} justify="center">
      //   <Box direction="row" justify="between">
      //     <Box alignContent="center" onClick={()=>this.setState({"active": "a"})}>A</Box>
      //     <Box alignContent="center" onClick={()=>this.setState({"active": "b"})}>B</Box>
      //     <Box alignContent="center" onClick={()=>this.setState({"active": "c"})}>C</Box>
      //   </Box>
      //   <Box flex="grow" colorIndex="brand">
      //     {this.renderLayout()}
      //   </Box>
      // </Box>
      <CleanForm
        schema={this.props.schema.toJS()}
        uiSchema={this.props.uiSchema.toJS()}
        formData={{}}
      >
        <span />
      </CleanForm>
    );
  }
}

// <CleanForm
// schema={this.props.schema.toJS()}
// uiSchema={this.props.uiSchema.toJS()}
// formData={{}}
// >
// <span />
// </CleanForm>

FormPreview.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

export default FormPreview;
