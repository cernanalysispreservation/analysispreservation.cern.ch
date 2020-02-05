import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Select from "grommet/components/Select";
import TextInput from "grommet/components/TextInput";
import FormField from "grommet/components/FormField";

import Zenodo from "./components/Zenodo/Zenodo";
import Orcid from "./components/ORCID/Orcid";
import Ror from "./components/ROR/ROR";

import SelectLabel from "./components/SelectLabel";

import FormTrashIcon from "grommet/components/icons/base/FormTrash";

import Spinning from "grommet/components/icons/Spinning";

import axios from "axios";

class ServiceIDGetter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      service:
        this.props.uiSchema["ui:servicesList"].length < 2
          ? this.props.uiSchema["ui:servicesList"][0]
          : "",
      error: null,
      editEnabled: this.props.formData.source ? false : true,
      loader: false
    };
  }

  componentDidMount() {
    if (this.props.uiSchema["ui:renderOption"]) {
      this.onServiceChange({ value: this.props.uiSchema["ui:renderOption"] });
    }
  }

  services = {
    zenodo: {
      url: "/api/services/zenodo/record/"
    },
    orcid: {
      url: "/api/services/orcid/"
    },
    ror: {
      url: "/api/services/ror/"
    }
  };

  getId(service, id) {
    switch (service) {
      case "zenodo":
        if (id.match(/\W+(zenodo.org)/)) {
          return id.match(/(record\/)(.*)(#*)/)[2];
        }
        break;
      case "orcid":
        if (id.match(/\W+(orcid.org)/)) {
          return id.match(/(orcid.org\/)(.*)/)[2];
        }
        break;
      case "ror":
        if (id.match(/\W+(ror.org)/)) {
          return id.match(/(ror.org\/)(.*)/)[2];
        }
        break;

      default:
        return id;
    }

    return id;
  }

  getResource = () => {
    this.setState({ error: null }); // Clean errors
    let service = this.services[this.state.service.value] || null;

    /**
     * Check whether the user provided only the id of the resource
     * If the user provided the whole url, extract the id from it
     */

    let resourceID = this.getId(this.state.service.value, this.state.id);

    if (service && !resourceID == "") {
      this.setState({ loader: true });
      axios
        .get(service.url + resourceID)
        .then(resp => {
          let { status } = resp.data;

          if (!status) {
            let resource_data = {
              source: {
                service: this.state.service.value,
                externalID: resourceID
              },
              fetched: resp.data
            };

            this.props.onChange(resource_data);
            this.setState({ editEnabled: false, loader: false });
          } else {
            this.setState({
              error: "Resource not found or unaccesible",
              loader: false
            });
          }
        })
        .catch(() => {
          this.setState({
            error: "Resource not found or unaccesible",
            loader: false
          });
        });
    } else {
      this.setState({
        error: "Please make sure you filled in all the inputs",
        loader: false
      });
    }

    this.setState({ id: "" });
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
              {this.props.title ||
                (this.props.schema && this.props.schema.title)}
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
              {this.props.formData.fetched &&
                this.props.formData.source.service == "ror" && (
                  <Ror data={this.props.formData.fetched} />
                )}
              {this.props.formData.fetched &&
                this.props.formData.source.service == "zenodo" && (
                  <Zenodo data={this.props.formData.fetched} />
                )}
              {this.props.formData.fetched &&
                this.props.formData.source.service == "orcid" && (
                  <Orcid data={this.props.formData.fetched} />
                )}
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
              {this.props.uiSchema["ui:servicesList"].length < 2 ? (
                <SelectLabel
                  service={this.props.uiSchema["ui:servicesList"][0]}
                />
              ) : (
                <Select
                  value={this.state.service}
                  placeHolder="Select service"
                  options={this.props.uiSchema["ui:servicesList"].map(
                    service => {
                      return {
                        value: service.value,
                        label: <SelectLabel service={service} />
                      };
                    }
                  )}
                  onChange={this.onServiceChange}
                />
              )}
              <Box pad="small" colorIndex="light-2">
                <TextInput
                  placeHolder="ID here"
                  value={this.state.url}
                  onDOMChange={this.onIDChange}
                />
              </Box>
              {this.state.loader ? (
                <Box>
                  <Spinning />
                </Box>
              ) : (
                <Box
                  onClick={this.getResource}
                  pad="small"
                  justify="center"
                  align="center"
                  colorIndex="grey-2"
                >
                  GET
                </Box>
              )}
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
  rawDescription: PropTypes.string,
  title: PropTypes.string,
  schema: PropTypes.object,
  id: PropTypes.string,
  label: PropTypes.string
};

export default ServiceIDGetter;
