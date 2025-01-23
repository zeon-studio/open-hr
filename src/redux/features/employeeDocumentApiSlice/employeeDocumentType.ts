export type TDocument = {
  _id?: string;
  name: string;
  file: string;
  date: Date;
};

export type TEmployeeDocument = {
  employee_id: string;
  documents: TDocument[];
  createdAt?: Date;
};

export type TEmployeeDocumentState<T = TEmployeeDocument[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};
