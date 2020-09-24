import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import { AiOutlineLink } from "react-icons/ai";

import OrcidIcon from "../../grommet/fields/ServiceIdGetter/components/ORCID/ORCidIcon";
import RorIcon from "../../grommet/fields/ServiceIdGetter/components/ROR/RORIcon";
import ZenodoIcon from "../../grommet/fields/ServiceIdGetter/components/Zenodo/ZenodoIcon";

import Tag from "../../../../../partials/Tag";

import Anchor from "../../../../../partials/Anchor";

const ServiceGetter = props => {
  const getContentByService = service => {
    const choices = {
      orcid: props.formData.fetched.person && (
        <React.Fragment>
          <Box margin={{ right: "small" }}>
            <OrcidIcon />
          </Box>
          <Box>
            <Paragraph margin="none">
              {props.formData.fetched.person.name["family-name"].value}{" "}
              {props.formData.fetched.person.name["given-names"].value}
            </Paragraph>
            <Box direction="row" responsive={false}>
              <Paragraph
                margin="none"
                style={{
                  fontSize: "14px",
                  color: "rgba(0,0,0,0.6)"
                }}
              >
                ({props.formData.fetched.person.name["path"]})
              </Paragraph>
              <Anchor
                href={props.formData.fetched["orcid-identifier"].uri}
                target="_blank"
                style={{ marginLeft: "5px" }}
              >
                <AiOutlineLink size={18} />
              </Anchor>
            </Box>
          </Box>
        </React.Fragment>
      ),
      zenodo: props.formData.fetched.metadata && (
        <React.Fragment>
          <Box margin={{ right: "small" }}>
            <ZenodoIcon />
          </Box>
          <Box>
            <Paragraph margin="none">
              {props.formData.fetched.metadata.title}
            </Paragraph>
            <Box direction="row" responsive={false}>
              <Paragraph
                margin="none"
                style={{
                  fontSize: "14px",
                  color: "rgba(0,0,0,0.6)"
                }}
              >
                {props.formData.fetched.doi}
              </Paragraph>
              <Anchor
                href={props.formData.fetched.links.html}
                target="_blank"
                style={{ marginLeft: "3px" }}
              >
                <AiOutlineLink size={18} />
              </Anchor>
            </Box>
          </Box>
        </React.Fragment>
      ),
      ror: props.formData.fetched && (
        <React.Fragment>
          <Box margin={{ right: "small" }}>
            <RorIcon />
          </Box>
          <Box>
            <Paragraph margin="none" style={{ marginRight: "5px" }}>
              {props.formData.fetched.name}
            </Paragraph>
            <Box direction="row" align="center" responsive={false}>
              <Tag
                size="small"
                text={props.formData.fetched.types}
                color={{
                  bgcolor: "rgba(67,135,170,1)",
                  border: "rgba(67,135,170,1)",
                  color: "#f9f0ff"
                }}
              />
              <Paragraph
                margin="none"
                style={{
                  fontSize: "16px",
                  color: "rgba(0,0,0,0.6)",
                  margin: "0 0 0 10px"
                }}
              >
                {props.formData.fetched.acronyms
                  ? `${props.formData.fetched.acronyms},`
                  : ""}
                {props.formData.fetched.country &&
                  props.formData.fetched.country.country_code}
              </Paragraph>
              <Anchor
                href={props.formData.fetched.links}
                target="_blank"
                style={{ marginLeft: "3px" }}
              >
                <AiOutlineLink size={18} />
              </Anchor>
            </Box>
          </Box>
        </React.Fragment>
      )
    };

    return choices[service];
  };

  return (
    <Box
      direction="row"
      align="center"
      responsive={false}
      pad={{ horizontal: "medium" }}
    >
      {props.formData && props.formData.fetched
        ? getContentByService(props.formData.source.service)
        : null}
    </Box>
  );
};

ServiceGetter.propTypes = {
  formData: PropTypes.object
};

export default ServiceGetter;
