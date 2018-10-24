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
    label={<Label size="small">Access</Label>}
    onClick={() => history.push(`/drafts/${draft_id}/settings`)}
  />
));

export const EditAnchor = withRouter(({ history, draft_id = draft_id }) => (
  <Box colorIndex="brand" pad={{ horizontal: "small" }}>
    <Anchor
      icon={<Edit size="xsmall" />}
      primary={true}
      label={<Label size="small">Edit</Label>}
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
    label={<Label size="small">Publish</Label>}
    onClick={action ? action : null}
  />
);

export const ShareAnchor = ({ action = null }) => (
  <Anchor
    icon={<AnnounceIcon size="xsmall" />}
    label={<Label size="small">Publish</Label>}
    onClick={action ? action : null}
  />
);

export const SaveAnchor = ({ action = null }) => (
  <Anchor
    icon={<SaveIcon size="xsmall" />}
    label={<Label size="small">Save</Label>}
    onClick={action ? action : null}
  />
);

export const CreateAnchor = ({ onClick = null }) => (
  <Anchor
    icon={<SaveIcon size="xsmall" />}
    label={<Label size="small">Save</Label>}
    onClick={onClick}
  />
);

export const DeleteAnchor = ({ action = null }) => (
  <Anchor
    label={<Label size="small">Delete</Label>}
    icon={<TrashIcon size="xsmall" />}
    onClick={action ? action : null}
  />
);

export const DiscardAnchor = ({ action = null }) => (
  <Anchor
    label={<Label size="small">Discard</Label>}
    icon={<RefreshIcon size="xsmall" />}
    onClick={action ? action : null}
  />
);

export const DraftMessage = ({ message, loading }) => {
  return message ? (
    <Box
      colorIndex="light-1"
      direction="row"
      pad={{ horizontal: "small" }}
      align="center"
      justify="between"
      margin={{ left: "small" }}
    >
      {[
        loading ? (
          <Spinning key="loading-spinner" />
        ) : (
          <Status size="small" key="loading" value={message.status} />
        ),
        message && (
          <Box key="message" pad={{ horizontal: "small" }}>
            <Label size="small">{message.msg}</Label>
          </Box>
        )
      ]}
    </Box>
  ) : null;
};
