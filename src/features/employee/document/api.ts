import { apiRequest, createMutationHook, createQueryHook } from "@/lib/api-client";
import { TPagination } from "@/types";

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

export const useGetEmployeeDocumentsQuery = createQueryHook<
  TEmployeeDocumentState,
  TPagination
>(({ page, limit, search }) =>
  apiRequest<TEmployeeDocumentState>({
    url: `/employee-document?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
  }),
  ["employee-document"],
);

export const useGetEmployeeDocumentQuery = createQueryHook<
  TEmployeeDocumentState<TEmployeeDocument>,
  string
>((id) =>
  apiRequest<TEmployeeDocumentState<TEmployeeDocument>>({
    url: `/employee-document/${id}`,
    method: "GET",
  }),
  ["employee-document"],
);

export const useAddEmployeeDocumentMutation = createMutationHook<
  TEmployeeDocumentState,
  TEmployeeDocument
>((data) =>
  apiRequest<TEmployeeDocumentState>({
    url: `/employee-document/${data.employee_id}`,
    method: "PATCH",
    body: data,
  }),
  { invalidatesTags: ["employee-document"] },
);

export const useUpdateEmployeeDocumentMutation = createMutationHook<
  TEmployeeDocumentState,
  TEmployeeDocument
>((data) =>
  apiRequest<TEmployeeDocumentState>({
    url: `/employee-document/${data.employee_id}`,
    method: "PATCH",
    body: data,
  }),
  { invalidatesTags: ["employee-document"] },
);

export const useDeleteEmployeeDocumentMutation = createMutationHook<
  TEmployeeDocumentState,
  { employeeId: string; documentId: string }
>(({ employeeId, documentId }) =>
  apiRequest<TEmployeeDocumentState>({
    url: `/employee-document/${employeeId}/${documentId}`,
    method: "DELETE",
  }),
  { invalidatesTags: ["employee-document"] },
);
