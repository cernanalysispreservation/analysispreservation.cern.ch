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

export default connect(
  state => state,
  mapDispatchToProps
)(RecipientsCustomConditions);
