import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Button from "../../Button";
import Tag from "../../Tag";
import ShowMoreText from "../../ShowMoreText";
import Heading from "grommet/components/Heading";
import { AiOutlineCheck, AiOutlineDelete } from "react-icons/ai";

const ReviewListItem = ({ review, reviewDraft, draft_id, loading }) => {
  const renderReviewTypeHeading = type => {
    const _types = {
      approved: "Approved",
      request_changes: "Changes Requested",
      declined: "Declined"
    };
    return <span>{_types[type]}</span>;
  };

  return (
    <Box flex key={review.id}>
      <Box
        wrap={false}
        colorIndex="light-1"
        pad={{ horizontal: "small", vertical: "small", between: "small" }}
      >
        <Box flex={true}>
          <Box direction="row" responsive={false}>
            <Heading tag="h5" margin={review.resolved ? "none" : null}>
              {renderReviewTypeHeading(review.type)} by{" "}
              <a href={`mailto:${review.reviewer}`}>{review.reviewer}</a>
            </Heading>
            {review.resolved && (
              <Box margin={{ left: "small" }}>
                <Tag
                  text="Resolved"
                  color={{
                    bgcolor: "#e6ffed",
                    border: "#e6ffed",
                    color: "#457352"
                  }}
                />
              </Box>
            )}
          </Box>

          <Box
            colorIndex={review.resolved ? "light-1" : "light-2"}
            style={{
              fontStyle: review.resolved ? "italic" : "normal"
            }}
            pad={{ horizontal: "small" }}
            margin={{ top: "small" }}
          >
            <Box
              margin="small"
              style={{
                margin: "12px 0",
                maxWidth: "100%",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: 1.375
              }}
            >
              <ShowMoreText lines={10} more="Show More" less="Show less">
                {review.body}
              </ShowMoreText>
            </Box>
          </Box>
        </Box>
        {!review.resolved && (
          <Box
            direction="row"
            justify="between"
            margin={{ top: "small" }}
            responsive={false}
          >
            <Button
              key="Delete"
              text="Delete"
              loading={loading}
              secondary
              icon={<AiOutlineDelete size={15} />}
              onClick={() =>
                reviewDraft(
                  draft_id,
                  {
                    id: review.id,
                    action: "delete"
                  },
                  "deleted"
                )
              }
            />
            <Button
              key="Resolve"
              text="Resolve"
              secondary
              loading={loading}
              icon={<AiOutlineCheck size={15} />}
              onClick={() =>
                reviewDraft(
                  draft_id,
                  {
                    action: "resolve",
                    id: review.id
                  },
                  "resolved"
                )
              }
            />
          </Box>
        )}
        <Box
          flex={true}
          style={{
            position: "absolute",
            zIndex: 1000,
            backgroundColor: "red"
          }}
        />
      </Box>
    </Box>
  );
};

ReviewListItem.propTypes = {
  review: PropTypes.object,
  draft_id: PropTypes.string,
  loading: PropTypes.bool,
  reviewDraft: PropTypes.func
};

export default ReviewListItem;
