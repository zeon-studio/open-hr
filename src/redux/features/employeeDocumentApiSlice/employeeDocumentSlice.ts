import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import {
  TEmployeeDocument,
  TEmployeeDocumentState,
} from "./employeeDocumentType";

export const useGetEmployeeDocumentsQuery = createQueryHook<
  TEmployeeDocumentState,
  TPagination
>(({ page, limit, search }) =>
  apiRequest<TEmployeeDocumentState>({
    url: `/employee-document?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
  }),
);

export const useGetEmployeeDocumentQuery = createQueryHook<
  TEmployeeDocumentState<TEmployeeDocument>,
  string
>((id) =>
  apiRequest<TEmployeeDocumentState<TEmployeeDocument>>({
    url: `/employee-document/${id}`,
    method: "GET",
  }),
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
);

export const useDeleteEmployeeDocumentMutation = createMutationHook<
  TEmployeeDocumentState,
  { employeeId: string; documentId: string }
>(({ employeeId, documentId }) =>
  apiRequest<TEmployeeDocumentState>({
    url: `/employee-document/${employeeId}/${documentId}`,
    method: "DELETE",
  }),
);
