import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, TextInput, List, ListItem, Label } from "grommet";
import Button from "../../../../../../../../partials/Button";
import { AiOutlineDelete } from "react-icons/ai";
import ReactPaginate from "react-paginate";

let emails = [
  "1@cern.ch",
  "2@cern.ch",
  "3@cern.ch",
  "4@cern.ch",
  "5@cern.ch",
  "6@cern.ch",
  "7@cern.ch",
  "8@cern.ch",
  "9@cern.ch",
  "10@cern.ch",
  "11@cern.ch",
  "12@cern.ch",
  "13@cern.ch",
  "14@cern.ch",
  "15@cern.ch",
  "16@cern.ch"
];
const RecipientsMAnuallyEmails = props => {
  const [value, setValue] = useState("");
  const [limits, setLimits] = useState({
    lower: 0,
    upper: 5
  });

  return (
    <Box pad="small">
      <Box
        align="center"
        direction="row"
        responsive={false}
        justify="between"
        margin={{ bottom: "medium" }}
      >
        <Box flex>
          <TextInput
            value={value}
            placeHolder="filter emails ..."
            onDOMChange={e => {
              setValue(e.target.value);
            }}
          />
        </Box>
        <Box flex align="end">
          <Button text="add" primary size="small" />
        </Box>
      </Box>
      <List>
        {emails.slice(limits.lower, limits.upper).map(email => (
          <ListItem key={email}>
            <Box
              direction="row"
              justify="between"
              responsive={false}
              align="center"
              flex
            >
              <Label margin="none" size="small">
                {email}
              </Label>
              <Button
                icon={<AiOutlineDelete size={18} />}
                size="iconSmall"
                criticalOutline
              />
            </Box>
          </ListItem>
        ))}
      </List>
      <Box
        align="center"
        direction="row"
        justify="center"
        pad="small"
        id="deposit-access-react-paginate"
      >
        <ReactPaginate
          pageCount={Math.ceil(emails.length / 5)}
          pageRangeDisplayed={2}
          marginPageDisplayed={2}
          previousLabel="<"
          nextLabel=">"
          activeClassName="react-paginate-selected-li"
          activeLinkClassName="react-paginate-selected-li-a"
          onPageChange={page => {
            setLimits({
              upper: 5 * (page.selected + 1),
              lower: 5 * (page.selected + 1) - 5
            });
          }}
        />
      </Box>
    </Box>
  );
};

RecipientsMAnuallyEmails.propTypes = {};

export default RecipientsMAnuallyEmails;
