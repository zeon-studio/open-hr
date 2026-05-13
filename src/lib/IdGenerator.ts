import variables from "@/config/variables";

const departmentGenerator: Record<string, string> = {
  development: "DEV",
  marketing: "MKT",
  design: "DGN",
  admin: "ADM",
  production: "PDC",
  hr_finance: "HRF",
  project_management: "PRM",
  other: "OTH",
};

const assetTypeGenerator: Record<string, string> = {
  macbook: "MBK",
  macmini: "MNI",
  imac: "IMC",
  laptop: "LPT",
  desktop: "DPT",
  mobile: "MBL",
  keyboard: "KBD",
  mouse: "MUS",
  monitor: "MON",
  headset: "HST",
  printer: "PRN",
  router: "RTR",
  other: "OTH",
};

const findYear = (date: Date) => date.getFullYear();
const make3digit = (num: number) => num.toString().padStart(3, "0");

export const generateEmployeeId = (
  department: string,
  joining_date: Date,
  departmentSerial: number,
) => {
  const prefix = variables.id_prefix || "EMP";
  return (
    prefix +
    (departmentGenerator[department] || "OTH") +
    findYear(joining_date) +
    make3digit(departmentSerial)
  );
};

export const generateAssetId = (assetType: string, assetSerial: number) => {
  const prefix = variables.id_prefix || "EMP";
  return `${prefix}_${assetTypeGenerator[assetType] || "OTH"}_${assetSerial}`;
};
