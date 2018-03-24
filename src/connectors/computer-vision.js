import fetch from "isomorphic-fetch";

const config = {
  url: "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0",
  apiKey1: process.env.AF_MICROSOFT_COMPUTER_VISION_API_KEY_1,
  apiKey2: process.env.AF_MICROSOFT_COMPUTER_VISION_API_KEY_2
};

const ComputerVision = () => {
  const analyze = params =>
    `${config.url}/analyze?subscription-key=${
      config.apiKey1
    }&language=en&detectOrientation=true&${params}`;

  return {
    analyze: file =>
      fetch(analyze("visualFeatures=Categories"), {
        method: "POST",
        body: file.stream,
        headers: new Headers({
          "Content-Type": "application/octet-stream",
          "Ocp-Apim-Subscription-Key": config.apiKey1
        })
      }).then(response => response.json())
  };
};

export default ComputerVision;
