import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import Box from "grommet/components/Box";
import PermissionTable from "./PermissionTable";
import { AiOutlineUser } from "react-icons/ai";
import { Paragraph } from "grommet";

const DepositAccessPagination = ({ users_roles, access }) => {
  const [limits, setLimits] = useState({
    upper: 5,
    lower: 0
  });
  const setRef = useRef(null);
  useEffect(
    () => {
      setRef.current && setRef.current.setState({ selected: 0 });
      setLimits({
        upper: 5,
        lower: 0
      });
    },
    [users_roles]
  );

  return (
    <Box>
      {users_roles.length > 0 ? (
        <PermissionTable
          users={
            users_roles.length <= 5
              ? users_roles
              : users_roles.slice(limits.lower, limits.upper)
          }
          access={access}
        />
      ) : (
        <Box pad="small" align="center">
          <Box
            colorIndex="light-2"
            align="center"
            pad="small"
            style={{ borderRadius: "50%" }}
          >
            <AiOutlineUser size={20} />
          </Box>
          <Paragraph>No results</Paragraph>
        </Box>
      )}

      {users_roles.length > 5 && (
        <Box
          align="center"
          direction="row"
          justify="center"
          pad="small"
          id="deposit-access-react-paginate"
        >
          <ReactPaginate
            ref={setRef}
            pageCount={Math.ceil(users_roles.length / 5)}
            pageRangeDisplayed={2}
            marginPageDisplayed={2}
            previousLabel="<"
            nextLabel=">"
            activeClassName="react-paginate-selected-li"
            activeLinkClassName="react-paginate-selected-li-a"
            onPageChange={page =>
              setLimits({
                upper: 5 * (page.selected + 1),
                lower: 5 * (page.selected + 1) - 5
              })
            }
          />
        </Box>
      )}
    </Box>
  );
};

DepositAccessPagination.propTypes = {
  users_roles: PropTypes.array,
  access: PropTypes.object
};

export default DepositAccessPagination;
