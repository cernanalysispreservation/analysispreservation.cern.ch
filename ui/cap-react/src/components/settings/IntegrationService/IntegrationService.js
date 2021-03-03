import React from "react";
import PropTypes from "prop-types";

import { Box, Label } from "grommet";
import Anchor from "../../partials/Anchor";
import Button from "../../partials/Button";
import { AiOutlineLink, AiOutlineDisconnect } from "react-icons/ai";

const IntegrationService = ({ onClick = null, service = "", data = null }) => {
  const getContentByService = service => {
    let choices = {
      github: (
        <Box align="center">
          <Label margin="none">{data.name}</Label>
          <Anchor href={data.profile_url} target="_blank">
            <Box direction="row" align="center" responsive={false}>
              <Label margin="none" size="small" style={{ color: "#2883d7" }}>
                {data.username}
              </Label>
              <AiOutlineLink />
            </Box>
          </Anchor>
        </Box>
      ),
      // orcid: (
      //   <Box align="center">
      //     <Label margin="none">{data.name}</Label>
      //     <Anchor href={data.orcid.url} target="_blank">
      //       <Box direction="row" align="center" responsive={false}>
      //         <Label margin="none" size="small" style={{ color: "#2883d7" }}>
      //           {data.orcid.id}
      //         </Label>
      //         <AiOutlineLink />
      //       </Box>
      //     </Anchor>
      //   </Box>
      // ),
      zenodo: (
        <Box align="center">
          <Label margin="none">Connected</Label>
        </Box>
      ),
      orcid: (
        <Box align="center">
          <Label margin="none">Connected</Label>
        </Box>
      )
    };

    service = service === "gitlab" ? "github" : service;
    return choices[service];
  };
  return (
    <Box>
      {getContentByService(service)}
      <Button
        text="Disconnect"
        icon={<AiOutlineDisconnect />}
        margin="10px 0 0 0 "
        onClick={onClick}
      />
    </Box>
  );
};

IntegrationService.propTypes = {
  onClick: PropTypes.func,
  service: PropTypes.string,
  data: PropTypes.object
};

export default IntegrationService;
