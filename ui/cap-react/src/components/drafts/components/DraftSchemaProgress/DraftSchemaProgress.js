import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";

import DraftSchemaBox from "./DraftSchemaBox";
import JSONSchemaPreviewer from "../../form/JSONSchemaPreviewer";

const DraftSchemaProgress = ({ schema, uiSchema, draft_id, metadata }) => {
  const [hiddenProps, setHiddenProps] = useState([]);
  const [_schemas, set_Schemas] = useState(Object.entries(schema.properties));
  const [fields, setFields] = useState([]);

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
      let depend = [];

      let temp = _schemas
        .filter(item => !hiddenProps.includes(item[0]))
        .filter(item => item[0] != "analysis_reuse_mode");

      // at this moment we probably do not want to display the analysis_reuse_mode dependency as metadata
      // therefore the filtering is manually. In the future we might want to display any other dependency and hide others
      // if the filtering is manual we can add values above.
      // if the filtering is for every dpendency we can replace the second filtering with this
      // .filter(item => !Object.keys(schema.dependencies).includes(item[0]));
      if (schema.dependencies) {
        let dependencies = Object.entries(schema.dependencies);
        dependencies.map(item => {
          if (item[0] in metadata) {
            depend = [...depend, ...Object.entries(item[1].properties)];
          }
        });
      }

      set_Schemas([...temp, ...depend]);
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
      <Box id="hide-div">
        <JSONSchemaPreviewer
          formData={metadata}
          schema={schema}
          uiSchema={uiSchema || {}}
          onChange={() => {}}
          updateFields={item => {
            let field = fields;

            let exists = 0;
            field.map(field => {
              if (field.id === item.id) {
                exists = 1;
                field.content = item.content;
              }
            });
            if (!exists) {
              field.push(item);
            }

            setFields(field);
          }}
        >
          <span />
        </JSONSchemaPreviewer>
      </Box>
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
  draft_id: PropTypes.string,
  metadata: PropTypes.object
};

export default DraftSchemaProgress;
