import { connect } from "react-redux";
import {
  updateOperatorToCheck,
  updateChecksInConditions,
  updateValueByPath
} from "../../../actions/schemaWizard";

import Conditions from "../components/Notifications/NotificationWizard/NewNotification/Recipients/utils/Conditions/Conditions";

const mapStateToProps = state => ({
  notification: state.schemaWizard.get("schemaConfig"),
  schema: state.schemaWizard.getIn(["current", "schema"])
});

const mapDispatchToProps = dispatch => ({
  updateOperatorByPath: (path, index, action) =>
    dispatch(updateOperatorToCheck(path, index, action)),
  updateChecksInConditions: (path, index, howToUpdate, emailType, type) =>
    dispatch(
      updateChecksInConditions(path, index, howToUpdate, emailType, type)
    ),
  updateValueByPath: (checkIndex, emailType, path, item, condition, val) =>
    dispatch(
      updateValueByPath(checkIndex, emailType, path, item, condition, val)
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Conditions);
