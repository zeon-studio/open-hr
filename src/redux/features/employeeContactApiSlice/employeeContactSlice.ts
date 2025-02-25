import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TEmployeeContact, TEmployeeContactState } from "./employeeContactType";

const employeeContactApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["employee-contacts"],
});

export const employeeContactApi = employeeContactApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeContacts: builder.query<TEmployeeContactState, TPagination>({
      query: ({ page, limit, search }) => ({
        url: `/employee-contact?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["employee-contacts"],
      keepUnusedDataFor: 30 * 60,
    }),

    getEmployeeContact: builder.query<
      TEmployeeContactState<TEmployeeContact>,
      string
    >({
      query: (id) => ({
        url: `/employee-contact/${id}`,
        method: "GET",
      }),
      providesTags: ["employee-contacts"],
    }),

    updateEmployeeContact: builder.mutation({
      query: (data) => {
        return {
          url: `/employee-contact/${data.employee_id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employee-contacts"],
    }),

    deleteEmployeeContact: builder.mutation({
      query: (id) => ({
        url: `/employee-contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employee-contacts"],
    }),
  }),
});

export const {
  useGetEmployeeContactsQuery,
  useGetEmployeeContactQuery,
  useUpdateEmployeeContactMutation,
  useDeleteEmployeeContactMutation,
} = employeeContactApi;
