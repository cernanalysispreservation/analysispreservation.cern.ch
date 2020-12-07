import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";

const GuidelinesPopUp = () => {
  const [selected, setSelected] = useState("guidelines");

  return (
    <Box flex align="center" justify="center">
      <Box size="large" pad="small" colorIndex="grey-3">
        <Box direction="row" align="center" justify="between">
          <Box onClick={() => setSelected("guidelines")}>
            <Heading
              tag="h3"
              style={{
                color:
                  selected === "guidelines" ? "rgb(0,0,0)" : "rgba(0,0,0,.5)"
              }}
            >
              Guidelines
            </Heading>
          </Box>
          <Box onClick={() => setSelected("suggestions")}>
            <Heading
              tag="h3"
              style={{
                color:
                  selected === "suggestions" ? "rgb(0,0,0)" : "rgba(0,0,0,0.4)"
              }}
            >
              Suggestions
            </Heading>
          </Box>
        </Box>
        {selected === "guidelines" ? (
          <Box colorIndex="grey-3">
            <Box
              colorIndex="light-1"
              margin={{ vertical: "small" }}
              pad="small"
            >
              1. Build your schema by dragging any field box you want from the
              left column to the drop area
            </Box>
            <Box
              colorIndex="light-1"
              margin={{ vertical: "small" }}
              pad="small"
            >
              2. Click the box that you dropped and you will be able to
              customize properties such as title, description, placeholder, etc
            </Box>
            <Box
              colorIndex="light-1"
              margin={{ vertical: "small" }}
              pad="small"
            >
              3. You can add nested fields only to specific building blocks such
              as JSON Object, Arrays, Tab, Accordion and Layer/Modal.
            </Box>
            <Box
              colorIndex="light-1"
              margin={{ vertical: "small" }}
              pad="small"
            >
              4. In order to add a field as nested element, hover it above the
              target field and drop it. Indicators will support you.
            </Box>
            <Box
              colorIndex="light-1"
              margin={{ vertical: "small" }}
              pad="small"
            >
              5. You can delete any field you want, by clicking the box, in
              order to get the Settings menu
            </Box>
            <Box
              colorIndex="light-1"
              margin={{ vertical: "small" }}
              pad="small"
            >
              6. Anytime you want you can download the schema you created, and
              use it. Currently, you can export your schema and uiSchema in a
              JSON format.
            </Box>
          </Box>
        ) : (
          <Box colorIndex="grey-3">
            <Box
              colorIndex="light-1"
              margin={{ vertical: "small" }}
              pad="small"
            >
              1. Depending on your needs, preferably you should start by adding
              a JSON Object and then everything nested to this root Object.
              Probably the TabField Object is best for your needs as a root
              Object
            </Box>
            <Box
              colorIndex="light-1"
              margin={{ vertical: "small" }}
              pad="small"
            >
              2.While adding a new field, make sure that you will added to the
              place you want to. Indicators will support you, in case of mistake
              there is a possibility to update the path of your field
            </Box>
            <Box
              colorIndex="light-1"
              margin={{ vertical: "small" }}
              pad="small"
            >
              3. Header contains menu to assist you and make your task easier.
              You can validate and inspect the changes you applied in a JSON
              format.
            </Box>
            <Box
              colorIndex="light-1"
              margin={{ vertical: "small" }}
              pad="small"
            >
              4. You can custimize and update the css of any field you added.
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

GuidelinesPopUp.propTypes = {
  selected: PropTypes.string
};

export default GuidelinesPopUp;
