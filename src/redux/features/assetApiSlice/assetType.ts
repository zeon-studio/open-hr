export type TLog = {
  type: "handover" | "return" | "repair" | "lost" | "damaged";
  description: string;
  date: Date;
};

export type TAsset = {
  asset_id: string;
  user: string;
  name: string;
  type:
    | "macbook"
    | "macmini"
    | "imac"
    | "laptop"
    | "desktop"
    | "mobile"
    | "keyboard"
    | "mouse"
    | "monitor"
    | "headset"
    | "printer"
    | "router"
    | "other";
  serial_number: string;
  price: number;
  currency: "bdt" | "usd";
  purchase_date: Date;
  archive: boolean;
  note: string;
  logs: TLog[];
  createdAt?: Date;
};

export type TAssetState<T = TAsset[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

export type TAllAssetsState = {
  success: boolean;
  message: string;
  result: (TAsset & { handover: TLog })[];
};
