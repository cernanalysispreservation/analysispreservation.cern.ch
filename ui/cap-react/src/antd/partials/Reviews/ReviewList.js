import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Collapse, Divider, Input, List, Space, Typography } from "antd";
import {
  CommentOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import ShowMoreText from "../ShowMoreText";
import Description from "./Description";

const PAGE_SIZE = 5;

const formatDate = (isoString) => {
  if (!isoString) return null;
  return new Date(isoString).toLocaleString();
};

const CommentItem = ({ comment, onReply, canReview }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(replyText, comment.id);
      setReplyText("");
      setShowReply(false);
    }
  };

  return (
    <div style={{ padding: "6px 0" }}>
      <Space size={6} align="center">
        <Typography.Text strong style={{ fontSize: 12 }}>
          {comment.reviewer}
        </Typography.Text>
        {comment.created_at && (
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            <ClockCircleOutlined style={{ marginRight: 2 }} />
            {formatDate(comment.created_at)}
          </Typography.Text>
        )}
      </Space>
      <div style={{ marginTop: 2 }}>
        <Typography.Text style={{ fontSize: 13 }}>
          {comment.body}
        </Typography.Text>
      </div>
      {canReview && (
        <Button
          type="link"
          size="small"
          icon={<CommentOutlined />}
          style={{ padding: 0, fontSize: 11, height: "auto" }}
          onClick={() => setShowReply(!showReply)}
        >
          Reply
        </Button>
      )}
      {showReply && (
        <Space.Compact style={{ width: "100%", marginTop: 4 }}>
          <Input
            size="small"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onPressEnter={handleSubmitReply}
          />
          <Button size="small" type="primary" onClick={handleSubmitReply}>
            Send
          </Button>
        </Space.Compact>
      )}
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object,
  onReply: PropTypes.func,
  canReview: PropTypes.bool,
};

const CommentThread = ({ comment, allComments, depth, onReply, canReview }) => {
  const children = allComments.filter((c) => c.parent_id === comment.id);
  const isNested = depth > 0;

  return (
    <div
      style={{
        marginLeft: isNested ? 16 : 0,
        borderLeft: isNested ? "2px solid #f0f0f0" : "none",
        paddingLeft: isNested ? 12 : 0,
      }}
    >
      <CommentItem
        comment={comment}
        onReply={onReply}
        canReview={canReview}
      />
      {children.map((child) => (
        <CommentThread
          key={child.id}
          comment={child}
          allComments={allComments}
          depth={depth + 1}
          onReply={onReply}
          canReview={canReview}
        />
      ))}
    </div>
  );
};

CommentThread.propTypes = {
  comment: PropTypes.object,
  allComments: PropTypes.array,
  depth: PropTypes.number,
  onReply: PropTypes.func,
  canReview: PropTypes.bool,
};

const CommentsSection = ({ comments = [], onAddComment, canReview }) => {
  const [commentText, setCommentText] = useState("");

  const topLevel = comments.filter((c) => !c.parent_id);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <div>
      {topLevel.map((comment) => (
        <CommentThread
          key={comment.id}
          comment={comment}
          allComments={comments}
          depth={0}
          onReply={onAddComment}
          canReview={canReview}
        />
      ))}
      {canReview && (
        <Space.Compact style={{ width: "100%", marginTop: 6 }}>
          <Input
            size="small"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onPressEnter={handleSubmitComment}
          />
          <Button size="small" type="primary" onClick={handleSubmitComment}>
            Comment
          </Button>
        </Space.Compact>
      )}
    </div>
  );
};

CommentsSection.propTypes = {
  comments: PropTypes.array,
  onAddComment: PropTypes.func,
  canReview: PropTypes.bool,
};

const ReviewItem = ({ item, canReview, submitReviewAction }) => {
  const commentCount = (item.comments || []).length;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Description review={item} />
          <div style={{ marginTop: 4 }}>
            <ShowMoreText italic={item.resolved}>{item.body}</ShowMoreText>
          </div>
        </div>
        {!item.resolved && (
          <Space size={4} style={{ flexShrink: 0 }}>
            <Button
              size="small"
              type="primary"
              disabled={!canReview}
              onClick={() =>
                submitReviewAction(
                  { action: "resolve", id: item.id },
                  "resolved"
                )
              }
            >
              Resolve
            </Button>
            <Button
              size="small"
              disabled={!canReview}
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                submitReviewAction(
                  { id: item.id, action: "delete" },
                  "deleted"
                )
              }
            />
          </Space>
        )}
      </div>
      {(commentCount > 0 || canReview) && (
        <Collapse
          size="small"
          ghost
          style={{ marginTop: 4 }}
          items={[
            {
              key: "comments",
              label: (
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  <MessageOutlined style={{ marginRight: 4 }} />
                  {commentCount > 0
                    ? `${commentCount} comment${commentCount !== 1 ? "s" : ""}`
                    : "Add comment"}
                </Typography.Text>
              ),
              children: (
                <CommentsSection
                  comments={item.comments || []}
                  canReview={canReview}
                  onAddComment={(body, parentId) =>
                    submitReviewAction(
                      {
                        id: item.id,
                        action: "comment",
                        body,
                        ...(parentId && { parent_id: parentId }),
                      },
                      "commented"
                    )
                  }
                />
              ),
            },
          ]}
        />
      )}
    </div>
  );
};

ReviewItem.propTypes = {
  item: PropTypes.object,
  canReview: PropTypes.bool,
  submitReviewAction: PropTypes.func,
};

const ReviewList = ({
  review,
  isReviewingPublished,
  reviewPublished,
  reviewDraft,
  draft_id,
  canReview,
}) => {
  const submitReviewAction = (payload, message) => {
    if (isReviewingPublished) {
      reviewPublished(payload, message);
    } else {
      reviewDraft(draft_id, payload, message);
    }
  };

  return (
    <List
      size="small"
      dataSource={review}
      pagination={
        review && review.length > PAGE_SIZE
          ? { pageSize: PAGE_SIZE, size: "small" }
          : false
      }
      locale={{ emptyText: "No reviews yet" }}
      renderItem={(item) => (
        <List.Item style={{ display: "block", padding: "12px 0" }}>
          <ReviewItem
            item={item}
            canReview={canReview}
            submitReviewAction={submitReviewAction}
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
