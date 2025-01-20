import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TCourse, TCourseState } from "./courseType";

const courseApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["courses"],
});

export const courseApi = courseApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<TCourseState, TPagination>({
      query: ({ page, limit, search }) => ({
        url: `/course?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["courses"],
      keepUnusedDataFor: 30 * 60,
    }),

    getCourse: builder.query<TCourseState<TCourse>, string>({
      query: (id) => ({
        url: `/course/${id}`,
        method: "GET",
      }),
      providesTags: ["courses"],
    }),

    addCourse: builder.mutation<TCourseState, TCourse>({
      query: (data) => ({
        url: `/course`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["courses"],
    }),

    updateCourse: builder.mutation({
      query: (data) => {
        return {
          url: `/course/${data.id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["courses"],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["courses"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
