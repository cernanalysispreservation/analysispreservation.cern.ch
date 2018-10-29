import React from "react";

import { Anchor, Button, Box, Label } from "grommet";

import AnnounceIcon from "grommet/components/icons/base/Announce";
import LinkPreviousIcon from "grommet/components/icons/base/LinkPrevious";
import SaveIcon from "grommet/components/icons/base/Save";
import ShareIcon from "grommet/components/icons/base/Share";
import TrashIcon from "grommet/components/icons/base/Trash";
import RefreshIcon from "grommet/components/icons/base/Refresh";
import Edit from "grommet/components/icons/base/Edit";
import Spinning from "grommet/components/icons/Spinning";
import Status from "grommet/components/icons/Status";

import { withRouter } from "react-router";

export const SettingsAnchor = withRouter(({ history, draft_id = draft_id }) => (
  <Anchor
    icon={<ShareIcon size="xsmall" />}
    label={
      <Label size="small" uppercase={true}>
        Access
      </Label>
    }
    onClick={() => history.push(`/drafts/${draft_id}/settings`)}
  />
));

export const EditAnchor = withRouter(({ history, draft_id = draft_id }) => (
  <Box pad={{ horizontal: "small" }}>
    <Anchor
      icon={<Edit size="xsmall" />}
      primary={true}
      label={
        <Label size="small" uppercase={true}>
          Edit
        </Label>
      }
      onClick={() => history.push(`/drafts/${draft_id}/edit`)}
    />
  </Box>
));

export const BackToEditAnchor = withRouter(({ history, draft_id = null }) => {
  return (
    <Anchor
      icon={<LinkPreviousIcon />}
      onClick={() => history.push(`/drafts/${draft_id}/edit`)}
    />
  );
});

export const ShareAnchor2 = ({ action = null }) => (
  <Button
    icon={<ShareIcon size="xsmall" />}
    label={
      <Label size="small" uppercase={true}>
        Publish
      </Label>
    }
    onClick={action ? action : null}
  />
);

export const ShareAnchor = ({ action = null }) => (
  <Anchor
    icon={<AnnounceIcon size="xsmall" />}
    label={
      <Label size="small" uppercase={true}>
        Publish
      </Label>
    }
    onClick={action ? action : null}
  />
);

export const SaveAnchor = ({ action = null }) => (
  <Anchor
    icon={<SaveIcon size="xsmall" />}
    label={
      <Label size="small" uppercase={true}>
        Save
      </Label>
    }
    onClick={action ? action : null}
  />
);

export const CreateAnchor = ({ onClick = null }) => (
  <Anchor
    icon={<SaveIcon size="xsmall" />}
    label={
      <Label size="small" uppercase={true}>
        Save & Continue
      </Label>
    }
    onClick={onClick}
  />
);

export const DeleteAnchor = ({ action = null }) => (
  <Anchor
    label={
      <Label size="small" uppercase={true}>
        Delete
      </Label>
    }
    icon={<TrashIcon size="xsmall" />}
    onClick={action ? action : null}
  />
);

export const DiscardAnchor = ({ action = null }) => (
  <Anchor
    label={
      <Label size="small" uppercase={true}>
        Discard
      </Label>
    }
    icon={<RefreshIcon size="xsmall" />}
    onClick={action ? action : null}
  />
);

export const DraftMessage = ({ message, loading }) => {
  return message ? (
    <Box direction="row" pad={{ horizontal: "small" }} full="horizontal">
      {[
        loading ? (
          <Spinning key="loading-spinner" />
        ) : (
          <Box margin={{ left: "medium" }} />
        ),
        message && (
          <Label size="medium" margin="none">
            {message.msg.toLowerCase()}
          </Label>
        )
      ]}
    </Box>
  ) : null;
};
