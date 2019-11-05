import React from "react";
import PropTypes from "prop-types";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Select from "grommet/components/Select";
import TextInput from "grommet/components/TextInput";
import FormField from "grommet/components/FormField";

import { ZenodoIcon } from "./components/ZenodoIcon";
import { ORCidIcon } from "./components/ORCidIcon";
import FormTrashIcon from "grommet/components/icons/base/FormTrash";

import axios from "axios";
import SelectLabel from "./components/selectLabel";

class ServiceIDGetter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      service: "",
      error: null,
      editEnabled: this.props.formData.source ? false : true
    };
  }

  services = {
    zenodo: {
      url: "/api/services/zenodo/record/"
    },
    orcid: {
      url: "/api/services/orcid/"
    }
  };

  getResource = () => {
    this.setState({ error: null }); // Clean errors

    let service = this.services[this.state.service.value] || null;
    if (service && !this.state.id == "") {
      axios
        .get(service.url + this.state.id)
        .then(resp => {
          let { status } = resp.data;

          if (!status) {
            let resource_data = {
              source: {
                service: this.state.service.value,
                externalID: this.state.id
              },
              fetched: resp.data
            };

            this.props.onChange(resource_data);
            this.setState({ editEnabled: false });
          } else {
            this.setState({ error: "Resource not found or unaccesible" });
          }
        })
        .catch(() => {});
    }
  };

  onServiceChange = ({ value }) => {
    this.setState({ service: value });
  };

  onIDChange = event => {
    this.setState({ id: event.target.value });
  };

  onRemoveFormData = () => {
    this.setState({ editEnabled: true });
    this.props.onChange({});
  };
  render() {
    return (
      <FormField
        label={
          <span>
            <span style={{ color: "#000" }}>
              {this.props.schema && this.props.schema.title}
            </span>
            {this.props.rawDescription ? (
              <span style={{ color: "#bbb" }}>
                &nbsp; {this.props.rawDescription}
              </span>
            ) : (
              <span style={{ color: "#bbb" }}>
                &nbsp; Attach here a resource fetched from a list of services
              </span>
            )}
          </span>
        }
        key={this.props.id + this.props.label}
        error={this.state.error}
      >
        <Box
          flex={true}
          direction="column"
          wrap={false}
          justify="between"
          pad={{ horizontal: "medium", vertical: "small" }}
        >
          {!this.state.editEnabled ? (
            <Box flex={false} colorIndex="light-3" direction="row">
              {this.props.formData.fetched ? (
                this.props.formData.source.service == "zenodo" ? (
                  <Box colorIndex="light-3" flex={true}>
                    <Box
                      flex={false}
                      direction="row"
                      pad={{ between: "small" }}
                      align="start"
                      justify="start"
                    >
                      <Box size="xsmall" flex={false} justify="start">
                        <span>ID:</span>{" "}
                      </Box>
                      <Box
                        direction="row"
                        justify="center"
                        align="center"
                        pad={{ between: "small" }}
                      >
                        <Label
                          flex={true}
                          justify="start"
                          align="start"
                          size="small"
                        >
                          {this.props.formData.fetched.id}
                        </Label>
                        <ZenodoIcon />
                      </Box>
                    </Box>
                    <Box
                      flex={false}
                      direction="row"
                      pad={{ between: "small" }}
                      align="start"
                      justify="start"
                    >
                      <Box
                        size="xsmall"
                        flex={false}
                        justify="start"
                        align="start"
                      >
                        <span>Title:</span>{" "}
                      </Box>
                      <Label flex={true} size="small">
                        {this.props.formData.fetched.metadata.title}
                      </Label>
                    </Box>
                    <Box
                      flex={false}
                      direction="row"
                      pad={{ between: "small" }}
                      align="start"
                      justify="start"
                    >
                      <Box size="xsmall" flex={false} justify="start">
                        <span>DOI:</span>{" "}
                      </Box>
                      <Label flex={true} size="small">
                        {this.props.formData.fetched.metadata.doi}
                      </Label>
                    </Box>
                    <Box
                      flex={true}
                      direction="row"
                      pad={{ between: "small" }}
                      align="start"
                      justify="start"
                    >
                      <Box size="xsmall" flex={false} justify="start">
                        <span>URL:</span>{" "}
                      </Box>
                      <Anchor
                        size="small"
                        href={this.props.formData.fetched.links.self}
                      >
                        {this.props.formData.fetched.links.self}
                      </Anchor>
                    </Box>
                  </Box>
                ) : (
                  <Box colorIndex="light-3" flex={true}>
                    <Box
                      flex={false}
                      direction="row"
                      pad={{ between: "small" }}
                      align="start"
                      justify="start"
                    >
                      <Box size="xsmall" flex={false} justify="start">
                        <span>ID:</span>{" "}
                      </Box>
                      <Box
                        direction="row"
                        justify="center"
                        align="center"
                        pad={{ between: "small" }}
                      >
                        <Label
                          flex={true}
                          justify="center"
                          align="center"
                          size="small"
                        >
                          {" "}
                          {this.props.formData.fetched["orcid-identifier"].path}
                        </Label>
                        <ORCidIcon />
                      </Box>
                    </Box>
                    <Box
                      flex={false}
                      direction="row"
                      pad={{ between: "small" }}
                      align="start"
                      justify="start"
                    >
                      <Box
                        size="xsmall"
                        flex={false}
                        justify="start"
                        align="start"
                      >
                        <span>Name:</span>{" "}
                      </Box>
                      <Label flex={true} size="small">
                        {
                          this.props.formData.fetched.person.name["family-name"]
                            .value
                        }{" "}
                        {
                          this.props.formData.fetched.person.name["given-names"]
                            .value
                        }
                      </Label>
                    </Box>
                    <Box
                      flex={true}
                      direction="row"
                      pad={{ between: "small" }}
                      align="start"
                      justify="start"
                    >
                      <Box size="xsmall" flex={false} justify="start">
                        <span>URL:</span>{" "}
                      </Box>
                      <Anchor
                        size="small"
                        href={
                          this.props.formData.fetched["orcid-identifier"].uri
                        }
                      >
                        {this.props.formData.fetched["orcid-identifier"].uri}
                      </Anchor>
                    </Box>
                  </Box>
                )
              ) : null}
              <Box
                flex={false}
                onClick={this.onRemoveFormData}
                colorIndex="light-2"
                justify="center"
              >
                <FormTrashIcon />
              </Box>
            </Box>
          ) : (
            <Box
              flex={false}
              align="center"
              direction="row"
              wrap={false}
              pad={{ between: "medium" }}
            >
              <Select
                value={this.state.service}
                placeHolder="Select service"
                options={[
                  {
                    value: "orcid",
                    label: SelectLabel(<ORCidIcon />, "ORCID")
                  },
                  {
                    value: "zenodo",
                    label: SelectLabel(<ZenodoIcon />, "Zenodo.org")
                  }
                ]}
                onChange={this.onServiceChange}
              />
              <Box pad="small" colorIndex="light-2">
                <TextInput
                  placeHolder="ID here"
                  value={this.state.url}
                  onDOMChange={this.onIDChange}
                />
              </Box>
              <Box
                onClick={this.getResource}
                pad="small"
                justify="center"
                align="center"
                colorIndex="grey-2"
              >
                GET
              </Box>
            </Box>
          )}
        </Box>
      </FormField>
    );
  }
}

ServiceIDGetter.propTypes = {
  onChange: PropTypes.func,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  schema: PropTypes.object,
  id: PropTypes.string,
  label: PropTypes.string,
  rawDescription: PropTypes.string
};

export default ServiceIDGetter;
