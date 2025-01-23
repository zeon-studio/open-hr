import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import {
  TEmployeeDocument,
  TEmployeeDocumentState,
} from "./employeeDocumentType";

const employeeDocumentApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["employee-documents"],
});

export const employeeDocumentApi = employeeDocumentApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeDocuments: builder.query<TEmployeeDocumentState, TPagination>({
      query: ({ page, limit, search }) => ({
        url: `/employee-document?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["employee-documents"],
      keepUnusedDataFor: 30 * 60,
    }),

    getEmployeeDocument: builder.query<
      TEmployeeDocumentState<TEmployeeDocument>,
      string
    >({
      query: (id) => ({
        url: `/employee-document/${id}`,
        method: "GET",
      }),
      providesTags: ["employee-documents"],
    }),

    addEmployeeDocument: builder.mutation<
      TEmployeeDocumentState,
      TEmployeeDocument
    >({
      query: (data) => {
        return {
          url: `/employee-document/${data.employee_id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employee-documents"],
    }),

    updateEmployeeDocument: builder.mutation<
      TEmployeeDocumentState,
      TEmployeeDocument
    >({
      query: (data) => {
        return {
          url: `/employee-document/${data.employee_id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employee-documents"],
    }),

    deleteEmployeeDocument: builder.mutation<
      TEmployeeDocumentState,
      {
        employeeId: string;
        documentId: string;
      }
    >({
      query: ({ employeeId, documentId }) => ({
        url: `/employee-document/${employeeId}/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employee-documents"],
    }),
  }),
});

export const {
  useGetEmployeeDocumentsQuery,
  useGetEmployeeDocumentQuery,
  useAddEmployeeDocumentMutation,
  useUpdateEmployeeDocumentMutation,
  useDeleteEmployeeDocumentMutation,
} = employeeDocumentApi;
