import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "../../../../../../../partials/Modal";
import { Box, Heading, Label, TextInput } from "grommet";
import EditableField from "../../../../../../../partials/EditableField";
import Button from "../../../../../../../partials/Button";
import HorizontalWithText from "../../../../../../../partials/HorizontalWithText";
import Tag from "../../../../../../../partials/Tag";
import ContextParams from "../../utils/ContextParams";

const RecipiensEmailModal = ({ onClose, updateEmail, size = 0 }) => {
  const [ctxParams, setCtxParams] = useState([]);
  const [formattedTag, setFormattedTag] = useState(false);
  const [simpleTag, setSimpleTag] = useState(false);
  const [formattedTemplate, setFormattedTemplate] = useState("");

  useEffect(
    () => {
      if (formattedTag) {
        setTimeout(() => setFormattedTag(false), 1000);
      }
    },
    [formattedTag]
  );

  useEffect(
    () => {
      if (simpleTag) {
        setTimeout(() => setSimpleTag(false), 1000);
      }
    },
    [simpleTag]
  );

  return (
    <Modal
      onClose={onClose}
      title={`Add recipient email (${size} emails)`}
      separator
    >
      <Box size={{ width: "xxlarge" }} pad="small">
        <Box direction="row" align="center">
          <Heading margin="none" tag="h4" strong>
            Simple Email
          </Heading>
          {simpleTag && (
            <Tag
              text="added"
              margin="0 0 0 5px"
              size="small"
              color={{
                color: "#389e0d",
                bgcolor: "#f6ffed",
                border: "#b7eb8f"
              }}
            />
          )}
        </Box>
        <Label margin="none" size="small">
          without dynamic parameters
        </Label>
        <Box align="start" margin={{ vertical: "medium" }}>
          <EditableField
            emptyValue="add email"
            onUpdate={val => {
              if (val.replace(/\s/g, "").length > 0) {
                updateEmail(["mails", "default"], val);
                setSimpleTag(true);
              }
            }}
          />
        </Box>
        <HorizontalWithText text="OR" />
        <Box margin={{ vertical: "medium" }}>
          <Box direction="row" align="center">
            <Heading tag="h4" margin="none" strong>
              Formatted Email
            </Heading>
            {formattedTag && (
              <Tag
                text="added"
                margin="0 0 0 5px"
                size="small"
                color={{
                  color: "#389e0d",
                  bgcolor: "#f6ffed",
                  border: "#b7eb8f"
                }}
              />
            )}
          </Box>
          <Label margin="none" size="small">
            with dynamic parameters
          </Label>
          <Box margin={{ vertical: "small" }} pad="small">
            <Heading tag="h4" margin="none">
              Email Address
            </Heading>
            <Box
              direction="row"
              align="center"
              justify="between"
              margin={{ top: "small" }}
            >
              <TextInput
                placeHolder="add email address"
                value={formattedTemplate}
                onDOMChange={e => setFormattedTemplate(e.target.value)}
              />
            </Box>
            <Box margin={{ top: "large" }}>
              <Heading tag="h4" margin="none">
                Context
              </Heading>
              <ContextParams
                header="Context"
                ctx={[]}
                onChange={val => setCtxParams(previous => [...previous, val])}
              />
              <Box direction="row" wrap align="center" responsive={false}>
                {ctxParams.map((item, index) => (
                  <Box
                    pad="small"
                    separator="all"
                    key={index}
                    margin={{ right: "small" }}
                  >
                    {item.method ? (
                      <React.Fragment>
                        <Tag text="method" margin="0 0 5px 0" />
                        <Tag text={`${item.method}`} />
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Tag text={`name - ${item.name}`} margin="0 0 5px 0" />
                        <Tag text={`path - ${item.path}`} />
                      </React.Fragment>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box align="center" margin={{ top: "medium" }}>
              <Button
                text="add email"
                disabled={
                  ctxParams.length == 0 ||
                  formattedTemplate.replace(/\s/g, "").length == 0
                }
                primary
                onClick={() => {
                  updateEmail(["mails", "formatted"], {
                    template: formattedTemplate,
                    ctx: ctxParams
                  });
                  setFormattedTemplate("");
                  setCtxParams([]);
                  setFormattedTag(true);
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

RecipiensEmailModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  updateEmail: PropTypes.func,
  size: PropTypes.number
};

export default RecipiensEmailModal;
