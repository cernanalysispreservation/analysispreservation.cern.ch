import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, FormField, TextInput } from "grommet";
import Button from "../../../../../../partials/Button";

const AddParameterManually = props => {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");

  return (
    <Box align="center">
      <FormField style={{ marginTop: "20px" }}>
        <TextInput
          name="subject-input"
          placeHolder="add name"
          value={name}
          onDOMChange={e => setName(e.target.value)}
        />
      </FormField>

      <FormField style={{ marginTop: "10px" }}>
        <TextInput
          name="subject-input"
          placeHolder="add path"
          value={path}
          onDOMChange={e => setPath(e.target.value)}
        />
      </FormField>
      <Box align="center" margin={{ top: "medium" }}>
        <Button
          text="add"
          primary
          onClick={() => {
            props.onUpdate({ name, path });
            setName("");
            setPath("");
          }}
        />
      </Box>
    </Box>
  );
};

AddParameterManually.propTypes = { onUpdate: PropTypes.func };

export default AddParameterManually;
