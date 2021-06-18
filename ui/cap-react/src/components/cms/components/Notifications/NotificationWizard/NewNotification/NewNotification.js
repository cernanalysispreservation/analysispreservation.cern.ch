import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import Button from "../../../../../partials/Button";
import Anchor from "../../../../../partials/Anchor";
import { AiOutlineArrowLeft } from "react-icons/ai";
import CleanForm from "../../../../../drafts/form/CleanForm";
import ContextField from "../../../../../drafts/form/themes/grommet/fields/ContextField";
import JinjaWidget from "../../../../../drafts/form/themes/grommet/widgets/JinjaEditorWidget";
import { schema, uiSchema } from "./utils/schemas";
import { CMS } from "../../../../../routes";

const NewNotification = props => {
  let header = "edit notification";

  const {
    id = null,
    category = "",
    schema_name,
    schema_version
  } = props.match.params;

  const categoryIsValid = ["review", "publish"].includes(category);
  // in case the category is misspelled
  if (!categoryIsValid || !props.selectedNotification) {
    schema_version
      ? props.pushPath(`${CMS}/${schema_name}/${schema_version}/notifications`)
      : props.pushPath(`${CMS}/${schema_name}/notifications`);
    return null;
  }
  const notificationsByCategory = props.selectedNotification.get(category);

  const idIsValid =
    Number(id) >= 0 && Number(id) < notificationsByCategory.size;

  // in case the id is out of range
  if (!idIsValid) {
    schema_version
      ? props.pushPath(`${CMS}/${schema_name}/${schema_version}/notifications`)
      : props.pushPath(`${CMS}/${schema_name}/notifications`);
    return null;
  }

  let data = notificationsByCategory.get(id).toJS();

  return (
    <Box className="newNotification">
      <Box
        pad="small"
        direction="row"
        colorIndex="light-2"
        margin={{ bottom: "medium" }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)"
        }}
      >
        <Box style={{ gridColumn: "1/2" }}>
          <Anchor
            path={
              props.location.pathname.split(
                `/${props.match.params.category}`
              )[0]
            }
          >
            <Button
              text="Notification list"
              icon={<AiOutlineArrowLeft size={16} />}
            />
          </Anchor>
        </Box>
        <Box style={{ gridColumn: "2/4" }} align="center" justify="center">
          <Heading tag="h3" strong margin="none">
            {header}
          </Heading>
        </Box>
      </Box>
      <Box align="center" justify="start">
        <Box size={{ width: "xxlarge" }} pad={{ vertical: "medium" }}>
          <CleanForm
            schema={schema}
            liveValidate
            uiSchema={uiSchema}
            widgets={{ jinja: JinjaWidget }}
            fields={{ ctx: ContextField }}
            formData={data}
            onChange={forms => {
              props.updateNotificationData(forms.formData, id, category);
            }}
          >
            <span />
          </CleanForm>
        </Box>
      </Box>
    </Box>
  );
};

NewNotification.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  selectedNotification: PropTypes.object,
  updateNotificationData: PropTypes.object,
  pushPath: PropTypes.func
};

export default NewNotification;
