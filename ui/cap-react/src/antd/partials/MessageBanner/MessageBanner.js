import { message, Button, Space, Typography } from "antd";

import { CloseOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import useStickyState from "../../hooks/useStickyState";

const bannerRaw = import.meta.env.VITE_CAP_BANNER;

const MessageBanner = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [bannerDismissed, setBannerDismissed] = useStickyState(
    false,
    "bannerDismissed"
  );

  useEffect(() => {
    if (bannerRaw) {
      try {
        const banner = JSON.parse(bannerRaw);
        if (banner.text != bannerDismissed)
          messageApi.open({
            type: banner.type || "info",
            duration: 0,
            content: (
              <Space size="small">
                <Typography.Text
                  style={{ maxWidth: "50vw" }}
                  ellipsis={{ tooltip: banner.text }}
                >
                  {banner.text}
                </Typography.Text>
                |
                {banner.url && (
                  <a href={banner.url} target="_blank" rel="noreferrer">
                    More info
                  </a>
                )}
                {!banner.permanent && (
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    size="small"
                    onClick={() => {
                      messageApi.destroy();
                      setBannerDismissed(banner.text);
                    }}
                  />
                )}
              </Space>
            ),
            style: {
              marginTop: "89vh",
            },
          });
      } catch (e) {
        // Wrong JSON format
      }
    }
  }, [bannerRaw, bannerDismissed]);

  return contextHolder;
};

export default MessageBanner;
