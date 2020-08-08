import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

import TextInput from "grommet/components/TextInput";
import FormField from "grommet/components/FormField";
import CheckBox from "grommet/components/CheckBox";
import InputWithButton from "../widgets/components/InputWithButton";

import Box from "grommet/components/Box";

import Button from "../../../../../partials/Button";
import Modal from "../../../../../partials/Modal";

class ImportLayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      fetchedResults: null,
      error: null,
      showTextArea: !this.props.options.listSuggestions,
      buttonLoading: false
    };

    this.uiOptionImport = this.props.options;
    this.pasteDesctiption =
      this.uiOptionImport && this.uiOptionImport.description
        ? this.uiOptionImport.description
        : "Paste your list here. Insert one item per line:";
    this.pastePlaceholder =
      this.uiOptionImport && this.uiOptionImport.placeholder
        ? this.uiOptionImport.placeholder
        : "ex.\n\nitem1 \n\nitem2 \n\nitem3\n";
  }

  _fetchQuerySuggestions = () => {
    let query = this.state.query;
    let url = this.props.options.listSuggestions;
    this.setState({ buttonLoading: true });

    axios
      .get(`${url}${query}`)
      .then(({ data }) => {
        this.setState({ fetchedResults: data });
        this.props.updateAll(data, true);

        this.setState({
          buttonLoading: false
        });
      })
      .catch(err => this.setState({ error: err, buttonLoading: false }));
  };

  render() {
    return (
      <Modal onClose={this.props.enableImport} tag="h5" background="#f5f5f5">
        <Box flex={false} size="xlarge" colorIndex="light-2">
          {this.props.options.listSuggestions && (
            <Box
              pad={{
                between: "small",

                horizontal: "small"
              }}
              wrap
              flex
            >
              <Box pad={{ vertical: "small" }}>
                Provide a pattern to fetch available paths
              </Box>
              <Box>
                <InputWithButton
                  buttons={
                    <Box justify="center">
                      <Button
                        margin="0 0 0 5px"
                        text="fetch"
                        onClick={() => this._fetchQuerySuggestions()}
                        primary
                        size="large"
                        loading={this.state.buttonLoading}
                      />
                    </Box>
                  }
                  input={
                    <FormField>
                      <TextInput
                        id="pattern"
                        name="pattern"
                        placeHolder="Insert your pattern e.x /dataset/*"
                        onDOMChange={e => {
                          this.setState({
                            query: e.target.value,
                            fetchedResults: null,
                            error: null
                          });
                          this.props.updateAll(
                            this.state.fetchedResults || [],
                            false
                          );
                        }}
                      />
                    </FormField>
                  }
                />
              </Box>
              <Box
                align="center"
                justify="center"
                className="import_list_checkboxes"
              >
                {this.state.fetchedResults ? (
                  this.state.fetchedResults.length > 0 ? (
                    <Box style={{ width: "100%" }}>
                      <Box
                        pad={{ vertical: "small" }}
                        margin={{ bottom: "small" }}
                      >
                        <CheckBox
                          key="Select All"
                          inline="true"
                          name="Select All"
                          label={`Select all (${
                            this.state.fetchedResults.length
                          })`}
                          checked={
                            this.props.data &&
                            this.state.fetchedResults.filter(
                              item => !this.props.data.includes(item)
                            ).length === 0
                          }
                          onChange={() => {
                            this.props.updateAll(
                              this.state.fetchedResults,
                              this.props.data &&
                                this.state.fetchedResults.filter(
                                  item => !this.props.data.includes(item)
                                ).length > 0
                            );
                          }}
                        />
                      </Box>
                      <Box
                        style={{
                          height: "100%",
                          maxHeight: "300px",
                          overflow: "auto"
                        }}
                      >
                        {this.state.fetchedResults.map((item, index) => (
                          <Box key={index} colorIndex="light-1">
                            <Box
                              align="start"
                              style={{
                                padding: "5px"
                              }}
                              margin={{ right: "small" }}
                            >
                              <CheckBox
                                key={item}
                                inline="true"
                                name={item}
                                label={item}
                                checked={
                                  this.props.data &&
                                  this.props.data.includes(item)
                                }
                                onChange={() =>
                                  this.props.updateClipboard(item)
                                }
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ) : this.state.error ? (
                    <Box>Error message</Box>
                  ) : (
                    <Box>Your query did not return results</Box>
                  )
                ) : null}
              </Box>
            </Box>
          )}
          <Box
            colorIndex="light-2"
            pad={{
              between: "small",
              vertical: "small",
              horizontal: "small"
            }}
            wrap={false}
            flex={true}
          >
            {this.state.showTextArea && (
              <Box flex={true}>
                <Box pad={{ vertical: "small" }}>{this.pasteDesctiption}</Box>
                <Box flex={true}>
                  <textarea
                    value={this.props.data}
                    rows="15"
                    placeholder={this.pastePlaceholder}
                    style={{
                      borderRadius: "0",
                      backgroundColor: "#fff",
                      height: "100%",
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: "100%",
                      wordBreak: "break-all"
                    }}
                    onChange={this.props.onDataChange}
                  />
                </Box>
              </Box>
            )}
            <Box>
              <Box
                flex={false}
                align="end"
                direction="row"
                wrap={false}
                alignContent="end"
                justify="between"
                pad={{ between: "small" }}
              >
                {this.props.options.listSuggestions && (
                  <Button
                    secondary
                    text={
                      this.state.showTextArea
                        ? "Hide List"
                        : "Add list manually"
                    }
                    onClick={() =>
                      this.setState({ showTextArea: !this.state.showTextArea })
                    }
                  />
                )}
                <Button
                  text="Import"
                  primary={this.props.data}
                  disabled={!this.props.data}
                  onClick={this.props.data ? this.props.onImport : null}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  }
}

ImportLayer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  onImport: PropTypes.func,
  onDataChange: PropTypes.func,
  updateClipboard: PropTypes.func,
  enableImport: PropTypes.func,
  updateAll: PropTypes.func
};

export default ImportLayer;
