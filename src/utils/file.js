import { toBuffer } from "convert-stream";

export const addBufferToFile = async resolveFile => {
  const file = await resolveFile;
  const buffer = await toBuffer(file.stream);
  return Object.assign(file, { buffer });
};
