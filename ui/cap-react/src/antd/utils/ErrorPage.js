import { Typography } from "antd";

const SNOW_INCIDENT_LINK =
  "https://cern.service-now.com/service-portal?id=sc_cat_item&name=incident&fe=CERN-Analysis-Preservation";

const ErrorPage = ({ error, componentStack }) => {
  console.error("Unexpected error", error, componentStack);

  return (
    <div style={{ margin: "30px" }}>
      <Typography.Title level={2} style={{ color: "crimson" }}>
        :( Something went wrong
      </Typography.Title>
      <Typography.Title level={5} style={{ color: "crimson" }}>
        Try following these steps to fix the problem:
      </Typography.Title>
      <Typography.Text style={{ color: "crimson" }}>
        <ul>
          <li>
            <span>Refresh the </span>
            <a href="#hardcore" onClick={() => window.location.reload()}>
              page
            </a>
          </li>
          <li>
            <span>Go back to the </span>
            <a href="/">Home page</a>
            <span> and try to come here again</span>
          </li>
          <li>
            <span>Open a </span>
            <a target="_blank" href={SNOW_INCIDENT_LINK}>
              service now incident
            </a>
            <span>, please include the details below in your message:</span>
          </li>
        </ul>
      </Typography.Text>

      <Typography.Paragraph
        style={{
          padding: "1em",
          backgroundColor: "rgba(0, 105, 150, 0.1)",
          borderTop: "1.2em solid rgb(0, 105, 150)",
          position: "relative",
        }}
      >
        {error.message}
      </Typography.Paragraph>
    </div>
  );
};

export default ErrorPage;
