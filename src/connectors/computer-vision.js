import fetch from "isomorphic-fetch";

const config = {
  url: "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0",
  apiKey1: proccess.env.AF_MICROSOFT_COMPUTER_VISION_API_KEY_1,
  apiKey2: proccess.env.AF_MICROSOFT_COMPUTER_VISION_API_KEY_2
};

const ComputerVision = () => {
  const analyze = params =>
    `${
      config.url
    }/analyze?subscription-key=${apiKey1}&language=en&detectOrientation=true&${params}`;

  return {
    analyze: file =>
      fetch(analyze("visualFeatures=Categories"), {
        method: "POST",
        body: file,
        headers: {
          "Content-Type": "application/octet-stream"
        }
      })
  };
};

export default ComputerVision;
