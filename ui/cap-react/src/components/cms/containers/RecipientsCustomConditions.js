import { connect } from "react-redux";
import {
  addNewCondition,
  removeCondition
} from "../../../actions/schemaWizard";
import RecipientsCustomConditions from "../components/Notifications/NotificationWizard/NewNotification/Recipients/RecipientsChoices/RecipientsCustomConditions";

const mapDispatchToProps = dispatch => ({
  addNewCondition: emailType => dispatch(addNewCondition(emailType)),
  removeCondition: (emailType, item) =>
    dispatch(removeCondition(emailType, item))
});

const mapStateToProps = state => ({
  schema: state.schemaWizard.getIn(["current", "schema"])
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipientsCustomConditions);
