import { connect } from "react-redux";
import { getSchema, schemaInit } from "../../../actions/schemaWizard";
import { replacePath } from "../../../actions/support";
import { slugify, _initSchemaStructure } from "../utils";
import AdminPanel from "../components/AdminPanel";

const mapDispatchToProps = dispatch => ({
  getSchema: (name, version) => dispatch(getSchema(name, version)),
  replacePath: path => dispatch(replacePath(path)),
  schemaInit: () =>
    dispatch(
      schemaInit(
        slugify(Math.random().toString() + "_" + "name"),
        _initSchemaStructure(),
        {
          fullname: name,
        }
      )
    ),
});

const mapStateToProps = state => ({
  schema: state.schemaWizard.getIn(["current", "schema"]),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPanel);
