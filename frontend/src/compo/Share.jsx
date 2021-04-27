import React from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  TelegramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "react-share";

function Share({ urlPathName }) {
  // window.location.origin + urlPathName
  const shareContent = {
    url: "youtube.com",
    quote:
      "Join MatesCon.com and be the part of a fantastic community, full of helpfull youth.",
    hashTag: "#Matescon #beThePart #doHelpGetHelp",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 23,
        left: -5,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <FacebookShareButton
          url={shareContent.url}
          quote={shareContent.quote}
          hashtag={shareContent.hashTag}
        >
          <FacebookIcon round={true} size={32}></FacebookIcon>
        </FacebookShareButton>
      </div>
      <div>
        <WhatsappShareButton url={shareContent.url} title={shareContent.quote}>
          <WhatsappIcon round={true} size={32}></WhatsappIcon>
        </WhatsappShareButton>
      </div>
      <div>
        <TelegramShareButton url={shareContent.url} title={shareContent.quote}>
          <TelegramIcon round={true} size={32}></TelegramIcon>
        </TelegramShareButton>
      </div>
      <div>
        <LinkedinShareButton
          url={shareContent.url}
          title="Join MatesCon"
          summary={shareContent.quote}
          source="MatesCon.com"
        >
          <LinkedinIcon round={true} size={32}></LinkedinIcon>
        </LinkedinShareButton>
      </div>
      <div>
        <TwitterShareButton
          url={shareContent.url}
          title={shareContent.quote}
          hashtags={shareContent.hashTag.split(" ")}
        >
          <TwitterIcon round={true} size={32}></TwitterIcon>
        </TwitterShareButton>
      </div>
    </div>
  );
}

export default Share;
