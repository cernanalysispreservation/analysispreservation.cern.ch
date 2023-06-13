import PropTypes from "prop-types";
import { Button, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import ShowMoreText from "../ShowMoreText";
import Description from "./Description";

const ReviewList = ({
  review,
  isReviewingPublished,
  reviewPublished,
  reviewDraft,
  draft_id,
  canReview,
}) => {
  return (
    <List
      style={{ maxHeight: "50vh", overflowX: "hidden" }}
      dataSource={review}
      renderItem={item => (
        <List.Item
          actions={
            !item.resolved && [
              <Button
                key="resolve"
                type="primary"
                disabled={!canReview}
                onClick={() =>
                  isReviewingPublished
                    ? reviewPublished(
                        {
                          action: "resolve",
                          id: item.id,
                        },
                        "resolved"
                      )
                    : reviewDraft(
                        draft_id,
                        {
                          action: "resolve",
                          id: item.id,
                        },
                        "resolved"
                      )
                }
              >
                Resolve
              </Button>,
              <Button
                disabled={!canReview}
                key="delete"
                danger
                icon={<DeleteOutlined />}
                onClick={() =>
                  isReviewingPublished
                    ? reviewPublished(
                        {
                          id: item.id,
                          action: "delete",
                        },
                        "deleted"
                      )
                    : reviewDraft(
                        draft_id,
                        {
                          id: item.id,
                          action: "delete",
                        },
                        "deleted"
                      )
                }
              />,
            ]
          }
        >
          <List.Item.Meta
            description={
              <ShowMoreText italic={item.resolved}>{item.body}</ShowMoreText>
            }
            title={<Description review={item} />}
          />
        </List.Item>
      )}
    />
  );
};

ReviewList.propTypes = {
  review: PropTypes.object,
  isReviewingPublished: PropTypes.bool,
  canReview: PropTypes.bool,
  reviewPublished: PropTypes.func,
  reviewDraft: PropTypes.func,
  draft_id: PropTypes.string,
};

export default ReviewList;
