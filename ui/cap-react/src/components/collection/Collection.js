import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading, Label } from "grommet";
import Tag from "../partials/Tag";
import DocumentTitle from "../partials/Title";

import DashboardList from "../dashboard/DashboardList";
import DashboardListItem from "../dashboard/DashboardListItem";
import { fetchRecordsResults } from "../../actions/common";
import { AiOutlineQuestionCircle, AiOutlineDown } from "react-icons/ai";

import { connect } from "react-redux";
import { _getList } from "./utils";

import CollectionLoader from "./CollectionLoader";
import CollectionModal from "./CollectionModal";
import CollectionPermissions from "./CollectionPermissions";

import "./collection.css";
import MenuItem from "../partials/MenuItem";
import Menu from "../partials/Menu";
import ErrorScreen from "../partials/ErrorScreen";
import RichEditorWidget from "../drafts/form/themes/grommet/widgets/RichEditor/RichEditorWidget";

import NoDocs from "../../img/noDocs.svg";

const Collection = props => {
  // set var for modal
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // get URL params collection_name and version
    let { collection_name, version = null } = props.match.params;

    // fetch results for the deposit/records
    props.fetchRecordsResults(collection_name, version);
  }, []);

  //  display error screen when error occurs
  if (props.error) {
    return <ErrorScreen message={props.error} />;
  }
  // display loading screen while loading
  if (props.loading) {
    return <CollectionLoader />;
  }

  let { collection_name, version } = props.match.params;

  let lists = _getList(props.results);

  return (
    <DocumentTitle
      title={
        props.schema_data.has("fullname")
          ? props.schema_data.get("fullname")
          : "Collection"
      }
    >
      <Box align="center">
        <CollectionModal open={open} onClose={() => setOpen(false)} />
        <Box
          pad="small"
          style={{
            maxWidth: "1200px",
            width: "95%"
          }}
        >
          <Box colorIndex="light-2">
            <Box
              pad="large"
              style={{
                borderRadius: "5px",
                minHeight: "200px"
              }}
            >
              <Box
                responsive={false}
                direction="row"
                align="center"
                justify="between"
              >
                <Heading tag="h2" strong>
                  {props.schema_data.has("fullname") &&
                    props.schema_data.get("fullname")}
                </Heading>
                <div style={{ position: "relative" }}>
                  <Menu
                    top={35}
                    left={null}
                    right={1}
                    shadow
                    buttonProps={{
                      text: version ? version : "All versions",
                      icon: <AiOutlineDown />,
                      reverse: true
                    }}
                  >
                    <MenuItem
                      title="All versions"
                      hovered
                      onClick={() =>
                        props.history.push(`/collection/${collection_name}`)
                      }
                    />
                    {props.schema_data.has("versions") &&
                      props.schema_data
                        .get("versions")
                        .map(item => (
                          <MenuItem
                            key={item}
                            title={item}
                            hovered
                            onClick={() =>
                              props.history.push(
                                `/collection/${collection_name}/${item}`
                              )
                            }
                          />
                        ))}
                  </Menu>
                </div>
              </Box>
              <Box
                direction="row"
                align="center"
                margin={{ bottom: "small" }}
                responsive={false}
              >
                <Tag text={props.schema_data.get("name")} margin="0 10px 0 0" />
              </Box>
              <Label margin="none" size="small">
                {props.schema_data.hasIn(["config", "description"])
                  ? props.schema_data.getIn(["config", "description"])
                  : "No Description"}
              </Label>
            </Box>
          </Box>
          <Box
            margin={{ top: "medium" }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)"
            }}
          >
            <Box pad="small" className="collection-grid-large-column">
              <Box margin={{ bottom: "large " }}>
                <Heading tag="h6" uppercase strong>
                  readme
                </Heading>
                {props.schema_data.has("config") && (
                  <div className="collection-rich-editor">
                    {props.schema_data.hasIn(["config", "readme"]) ? (
                      <RichEditorWidget
                        value={props.schema_data.getIn(["config", "readme"])}
                        canViewProps={{ menu: false }}
                        viewProps={{ html: true, md: false }}
                        readonly
                      />
                    ) : (
                      <Box
                        flex
                        align="center"
                        colorIndex="light-2"
                        pad="medium"
                      >
                        <NoDocs />
                        <Label>No Content</Label>
                      </Box>
                    )}
                  </div>
                )}
              </Box>
              <Box>
                <Heading tag="h6" strong uppercase>
                  Latest Drafts
                </Heading>
                <Box pad="small" colorIndex="light-2">
                  <DashboardList
                    loading={props.loading}
                    listType="draft"
                    list={lists["drafts"]}
                    ListItem={DashboardListItem}
                    emptyMessage="Draft analyses that your collaborators have given you read/write access to."
                  />
                </Box>
              </Box>
              <Box margin={{ top: "large " }}>
                <Heading tag="h6" strong uppercase>
                  Latest Published
                </Heading>
                <Box pad="small" colorIndex="light-2">
                  <DashboardList
                    loading={props.loading}
                    listType="published"
                    list={lists["published"]}
                    ListItem={DashboardListItem}
                    emptyMessage="Published analyses that your collaborators have given you read/write access to."
                  />
                </Box>
              </Box>
            </Box>
            <Box
              pad="small"
              className="collection-grid-small-column"
              direction="row"
              responsive={false}
            >
              <Box
                style={{
                  width: "1px",
                  background: "rgba(0,0,0,.2)"
                }}
                className="horizontal-line"
              />
              <Box margin={{ left: "medium" }}>
                <Box
                  direction="row"
                  align="center"
                  margin={{ bottom: "small" }}
                  onClick={() => setOpen(true)}
                >
                  <Heading tag="h6" strong uppercase margin="none">
                    permissions
                  </Heading>
                  <AiOutlineQuestionCircle size={16} />
                </Box>
                <CollectionPermissions
                  permissions={props.schema_data.getIn([
                    "config",
                    "permissions"
                  ])}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </DocumentTitle>
  );
};

Collection.propTypes = {
  depositGroups: PropTypes.object,
  loading: PropTypes.bool,
  schema_data: PropTypes.object,
  fetchRecordsResults: PropTypes.func,
  results: PropTypes.object,
  error: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object
};

const mapStateToProps = state => ({
  results: state.collection.getIn(["results"]),
  depositGroups: state.auth.getIn(["currentUser", "depositGroups"]),
  schema_data: state.collection.get("schema_data"),
  loading: state.collection.get("loading"),
  error: state.collection.get("error")
});

const mapDispatchToProps = dispatch => ({
  fetchRecordsResults: (name, version) =>
    dispatch(fetchRecordsResults(name, version))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Collection);
