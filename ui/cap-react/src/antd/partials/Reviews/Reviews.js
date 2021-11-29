import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Form,
  Input,
  List,
  Modal,
  Radio,
  Typography
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import ShowMoreText from "../ShowMoreText";
import Description from "./Description";

const Reviews = ({
  review,
  draft_id,
  reviewDraft,
  reviewPublished,
  isReviewingPublished,
  publishedReviewError,
  draftReviewError
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [form] = Form.useForm();
  const closeModal = () => {
    setShowModal(false);
    form.resetFields();
  };

  // if the draft is not reviewable then return null
  if (!review) return null;

  return (
    <React.Fragment>
      <Modal
        visible={showModal}
        title="Add new Review"
        okText="Submit Review"
        okButtonProps={{
          onClick: () => form.submit()
        }}
        onCancel={() => setShowModal(false)}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            comment: "",
            reviewType: null
          }}
          onFinish={values => {
            isReviewingPublished
              ? reviewPublished({
                  body: values.comment,
                  type: values.reviewType
                }).then(response => {
                  response.error ? setShowError(true) : closeModal();
                })
              : reviewDraft(
                  draft_id,
                  {
                    body: values.comment,
                    type: values.reviewType
                  },
                  "submitted"
                ).then(response => {
                  response.error ? setShowError(true) : closeModal();
                });
          }}
        >
          <Form.Item
            label="Review Type"
            name="reviewType"
            rules={[{ required: true }]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="approved">Approve</Radio.Button>
              <Radio.Button value="request_changes">
                Request Changes
              </Radio.Button>
              <Radio.Button value="declined">Decline</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Review Comment"
            rules={[{ required: true }]}
            name="comment"
          >
            <Input.TextArea placeholder="add your comment..." rows={4} />
          </Form.Item>
        </Form>
        {showError && (
          <Typography.Text>
            {isReviewingPublished
              ? publishedReviewError && publishedReviewError.message
              : draftReviewError && draftReviewError.message}
          </Typography.Text>
        )}
      </Modal>
      <Card
        title="Reviews"
        extra={
          <Button type="primary" onClick={() => setShowModal(true)}>
            Add Review
          </Button>
        }
      >
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
                    onClick={() =>
                      isReviewingPublished
                        ? reviewPublished(
                            {
                              action: "resolve",
                              id: item.id
                            },
                            "resolved"
                          )
                        : reviewDraft(
                            draft_id,
                            {
                              action: "resolve",
                              id: item.id
                            },
                            "resolved"
                          )
                    }
                  >
                    Resolve
                  </Button>,
                  <Button
                    key="delete"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      isReviewingPublished
                        ? reviewPublished(
                            {
                              id: item.id,
                              action: "delete"
                            },
                            "deleted"
                          )
                        : reviewDraft(
                            draft_id,
                            {
                              id: item.id,
                              action: "delete"
                            },
                            "deleted"
                          )
                    }
                  />
                ]
              }
            >
              <List.Item.Meta
                description={
                  <ShowMoreText italic={item.resolved}>
                    {item.body}
                  </ShowMoreText>
                }
                title={<Description review={item} />}
              />
            </List.Item>
          )}
        />
      </Card>
    </React.Fragment>
  );
};

Reviews.propTypes = {
  review: PropTypes.object,
  draft_id: PropTypes.string,
  reviewDraft: PropTypes.func,
  reviewPublished: PropTypes.func,
  isReviewingPublished: PropTypes.bool,
  publishedReviewError: PropTypes.string,
  draftReviewError: PropTypes.string
};

export default Reviews;
