import ky from "ky";
const kyInstance = ky.create({
  timeout: 120 * 1000,
  parseJson: (text) =>
    JSON.parse(text, (key, value) => {
      if (key.endsWith("At") || key.endsWith("Time")) return new Date(value);
      return value;
    }),
});

export default kyInstance;
