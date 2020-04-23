import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean } from "@storybook/addon-knobs/react";
import StoryRouter from "storybook-react-router";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import PropTypes from "prop-types";
import SectionBox from "../SectionBox";
import { Anchors } from "../../drafts/components/Buttons";

class SectionBoxStorie extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grommet>
        <Box flex={true} size={{ width: { min: "medium" } }}>
          <SectionBox {...this.props} />
        </Box>
      </Grommet>
    );
  }
}
SectionBoxStorie.propTypes = {
  schema: PropTypes.object,
  rawDescription: PropTypes.string
};

storiesOf("Section Box", module)
  .addDecorator(StoryRouter())
  .addDecorator(withKnobs)
  .add("Default", () => {
    let props = {
      headerActions: (
        <Anchors
          draft_id={"12"}
          tab="integrations"
          label={text("Label:", "Manage", "SECTION_BOX")}
        />
      ),
      header: text("Header:", "header", "SECTION_BOX"),
      body: (
        <Box pad="small">
          <Box
            key="header"
            direction="row"
            wrap={false}
            justify="between"
            pad={{ between: "small" }}
            margin={{ bottom: "small" }}
          >
            {" "}
            <Box flex={false}>
              <strong>Source</strong>
            </Box>
            <Box flex={true}>
              <strong>Repository</strong>
            </Box>
            <Box flex={false}>
              <strong>Branch/Ref</strong>
            </Box>
          </Box>
        </Box>
      ),
      emptyMessage: "Empty Message",
      more: boolean("More: ", true, "SECTION_BOX")
    };
    return <SectionBoxStorie {...props} />;
  });
