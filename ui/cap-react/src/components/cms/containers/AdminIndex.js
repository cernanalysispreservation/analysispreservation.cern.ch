import { connect } from "react-redux";
import AdminIndex from "../AdminIndex";
import { getSchema, schemaInit } from "../../../actions/schemaWizard";
import { replacePath } from "../../../actions/support";
import { slugify, _initSchemaStructure } from "../utils";

const mapDispatchToProps = dispatch => ({
  getSchema: (name, version) => dispatch(getSchema(name, version)),
  replacePath: path => dispatch(replacePath(path)),
  schemaInit: () =>
    dispatch(
      schemaInit(
        slugify(Math.random().toString() + "_" + "name"),
        _initSchemaStructure("name", "description"),
        {
          fullname: name
        }
      )
    )
});

const mapStateToProps = state => ({
  schema: state.schemaWizard.getIn(["current", "schema"])
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminIndex);
