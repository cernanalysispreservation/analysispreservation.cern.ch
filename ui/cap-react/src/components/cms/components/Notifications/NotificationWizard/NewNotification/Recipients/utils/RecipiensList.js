import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, List, ListItem, Label, TextInput } from "grommet";
import Button from "../../../../../../../partials/Button";
import ReactPaginate from "react-paginate";
import { AiOutlineDelete } from "react-icons/ai";
import Modal from "./RecipiensEmailModal";

const RecipiensList = ({ emailsList = [], updateList }) => {
  const [openModal, setOpenModal] = useState(false);
  const [filters, setFilters] = useState("");
  const [limits, setLimits] = useState({
    lower: 0,
    upper: 5
  });

  const filtered = emailsList.filter(item => {
    if (item.get("type") === "default")
      return item.get("email").includes(filters);
    else return item.get("email").template.includes(filters);
  });

  return (
    <Box>
      {openModal && (
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          updateEmail={updateList}
          size={emailsList.length}
        />
      )}
      <Box
        align="center"
        direction="row"
        responsive={false}
        justify="between"
        margin={{ bottom: "medium" }}
      >
        <Box flex>
          <TextInput
            value={filters}
            placeHolder="filter emails ..."
            onDOMChange={e => {
              setFilters(e.target.value);
            }}
          />
        </Box>
        <Box flex align="end">
          <Button
            text="add"
            primary
            size="small"
            onClick={() => setOpenModal(true)}
          />
        </Box>
      </Box>
      <List>
        {filtered.slice(limits.lower, limits.upper).map(email => (
          <ListItem key={email.get("email")}>
            <Box
              direction="row"
              justify="between"
              responsive={false}
              align="center"
              flex
            >
              <Label margin="none" size="small">
                {email.get("type") === "default"
                  ? email.get("email")
                  : email.get("email").template}
              </Label>
              <Button
                icon={<AiOutlineDelete size={18} />}
                size="iconSmall"
                criticalOutline
                onClick={() =>
                  updateList(["mails", email.get("type")], email.get("email"))
                }
              />
            </Box>
          </ListItem>
        ))}
      </List>
      {emailsList.length > 5 && (
        <Box
          align="center"
          direction="row"
          justify="center"
          pad="small"
          id="deposit-access-react-paginate"
        >
          <ReactPaginate
            pageCount={Math.ceil(emailsList.length / 5)}
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
      )}
    </Box>
  );
};

RecipiensList.propTypes = {
  emailsList: PropTypes.array,
  updateList: PropTypes.func
};

export default RecipiensList;
