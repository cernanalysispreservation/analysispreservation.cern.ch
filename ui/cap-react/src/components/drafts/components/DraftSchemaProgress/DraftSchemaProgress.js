import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";

import DraftSchemaBox from "./DraftSchemaBox";

const DraftSchemaProgress = ({ schema, fields, uiSchema, draft_id }) => {
  const [hiddenProps, setHiddenProps] = useState([]);
  const [_schemas, set_Schemas] = useState(Object.entries(schema.properties));

  useEffect(() => {
    Object.entries(uiSchema).map(
      item =>
        item[1] &&
        item[1]["ui:options"] &&
        item[1]["ui:options"].hidden === true
          ? setHiddenProps([...hiddenProps, item[0]])
          : null
    );
  }, []);

  useEffect(
    () => {
      let temp = _schemas
        .filter(item => !hiddenProps.includes(item[0]))
        .filter(item => item[0] != "analysis_reuse_mode");

      set_Schemas(temp);
    },
    [hiddenProps]
  );

  return (
    <Box
      direction="row"
      responsive={false}
      wrap
      justify="start"
      pad={{ horizontal: "small" }}
    >
      {_schemas.map(item => (
        <Box
          key={item[0]}
          style={{
            height: "80px",
            width: "150px",
            padding: "5px 10px",
            borderRadius: "2px",
            position: "relative",
            zIndex: 1
          }}
          colorIndex="light-2"
          margin={{ bottom: "medium", right: "small" }}
          justify="between"
        >
          {item[1].title}
          <DraftSchemaBox item={item} fields={fields} draft_id={draft_id} />
        </Box>
      ))}
    </Box>
  );
};

DraftSchemaProgress.propTypes = {
  schema: PropTypes.object,
  felds: PropTypes.array,
  uiSchema: PropTypes.object,
  draft_id: PropTypes.string
};

export default DraftSchemaProgress;
