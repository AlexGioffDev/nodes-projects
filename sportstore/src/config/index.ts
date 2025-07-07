import { readFileSync } from "fs";
import { getEnvironment, Env } from "./environment";
import { merge } from "./merge";

const file = process.env.SERVER_CONFIG ?? "server.config.json";
const data = JSON.parse(readFileSync(file).toString());

try {
  const envFile = getEnvironment().toString() + "." + file;
  const envData = JSON.parse(readFileSync(envFile).toString());
  merge(data, envData);
} catch {
  // Nothing
}

export const getConfig = (path: string, defaultVal: any = undefined): any => {
  const paths = path.split(":");
  let val = data;
  paths.forEach((p) => (val = val[p]));
  return val ?? defaultVal;
};

export { getEnvironment, Env };
