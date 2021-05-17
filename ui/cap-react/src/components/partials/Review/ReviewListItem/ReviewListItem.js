import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Button from "../../Button";
import ShowMoreText from "../../ShowMoreText";
import Header from "./ReviewListItemHeader";
import { AiOutlineCheck, AiOutlineDelete } from "react-icons/ai";

const ReviewListItem = ({
  review,
  reviewDraft,
  reviewPublished,
  isReviewingPublished,
  draft_id,
  loading,
  shouldDisplayButtonsWhenFromPublished = true
}) => {
  const [contentShouldBeDisplayed, setContentShouldBeDisplayed] = useState(
    false
  );

  return (
    <Box
      pad="small"
      key={review.id}
      style={{
        border: "1px solid #e6e6e6",
        borderRadius: "3px"
      }}
      wrap={false}
      colorIndex="light-1"
    >
      <Header
        type={review.type}
        review={review}
        display={
          !review.resolved || (review.resolved && contentShouldBeDisplayed)
        }
        updateDisplayOptions={() =>
          setContentShouldBeDisplayed(
            contentShouldBeDisplayed => !contentShouldBeDisplayed
          )
        }
      />

      {!review.resolved || (review.resolved && contentShouldBeDisplayed) ? (
        <Box
          style={{
            fontStyle: review.resolved && "italic"
          }}
          pad={{ horizontal: "small" }}
          margin={{ vertical: "small" }}
        >
          <Label
            margin={{ vertical: "medium", horizontal: "small" }}
            size="small"
            style={{
              lineHeight: 1.7
            }}
          >
            <ShowMoreText lines={10} more="Show More" less="Show less">
              {review.body}
            </ShowMoreText>
          </Label>
        </Box>
      ) : null}

      {!review.resolved &&
        shouldDisplayButtonsWhenFromPublished && (
          <Box
            direction="row"
            justify="between"
            margin={{ top: "small" }}
            responsive={false}
            style={{
              borderTop: "1px solid #e6e6e6",
              padding: "10px 5px "
            }}
          >
            <Button
              key="Delete"
              text="Delete"
              loading={loading}
              secondary
              icon={<AiOutlineDelete size={15} />}
              onClick={() =>
                isReviewingPublished
                  ? reviewPublished(
                      {
                        id: review.id,
                        action: "delete"
                      },
                      "deleted"
                    )
                  : reviewDraft(
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
                isReviewingPublished
                  ? reviewPublished(
                      {
                        action: "resolve",
                        id: review.id
                      },
                      "resolved"
                    )
                  : reviewDraft(
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
    </Box>
  );
};

ReviewListItem.propTypes = {
  review: PropTypes.object,
  draft_id: PropTypes.string,
  loading: PropTypes.bool,
  reviewDraft: PropTypes.func,
  reviewPublished: PropTypes.func,
  shouldDisplayButtonsWhenFromPublished: PropTypes.bool,
  isReviewingPublished: PropTypes.bool
};

export default ReviewListItem;
