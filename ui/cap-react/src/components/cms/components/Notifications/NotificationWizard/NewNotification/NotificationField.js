import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import NotificationModal from "./NotificationModal";
import Parameter from "./utils/Parameter";
import { Map } from "immutable";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";

const NotificationField = ({
  header,
  template = "",
  ctx,
  field = "",
  updateNotification = null
}) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <React.Fragment>
      <NotificationModal
        ctx={ctx}
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={`add new ${header} parameter`}
        onChange={val => updateNotification([field, "ctx"], Map(val))}
        field={field}
        header={header}
      />
      <Box
        style={{ width: "90%", maxWidth: "992px" }}
        margin={{ bottom: "large" }}
      >
        <Heading tag="h3" strong>
          {header}
        </Heading>

        <Box separator="all">
          <AceEditor
            mode="django"
            theme="github"
            showPrintMargin={false}
            showGutter={false}
            highlightActiveLine={false}
            width="100%"
            height="200px"
            name="UNIQUE_ID_OF_DIV"
            value={template}
            onChange={val => {
              updateNotification([field, "template"], val);
            }}
            editorProps={{ $blockScrolling: true }}
          />
        </Box>
        <Parameter
          ctx={ctx}
          onClick={() => setOpenModal(true)}
          header="Parameters"
          updateNotification={val => updateNotification([field, "ctx"], val)}
        />
      </Box>
    </React.Fragment>
  );
};

NotificationField.propTypes = {
  header: PropTypes.string,
  field: PropTypes.string,
  template: PropTypes.string,
  ctx: PropTypes.object,
  updateNotification: PropTypes.func
};

export default NotificationField;
