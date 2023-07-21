import { Button, Card, Col, Row, Typography } from "antd";

const TourTooltip = ({
  index,
  step,
  backProps,
  primaryProps,
  tooltipProps,
  isLastStep,
  skipProps,
  total,
}) => {
  return (
    <Card {...tooltipProps} style={{ maxWidth: "300px", border: 0 }}>
      <Row justify="center">
        {step.title && (
          <Typography.Title level={5}>{step.title}</Typography.Title>
        )}
        <Typography.Text style={{ textAlign: "center" }}>
          {step.content}
        </Typography.Text>
      </Row>
      <Row style={{ marginTop: "20px" }} align="middle" gutter={10}>
        <Col flex="auto">
          <Button type="text" {...skipProps}>
            Skip
          </Button>
        </Col>
        <Col>{index > 0 && <Button {...backProps}>Back</Button>}</Col>
        <Col>
          <Button type="primary" {...primaryProps}>
            {isLastStep ? "Finish" : `Next (${index + 1}/${total})`}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default TourTooltip;
