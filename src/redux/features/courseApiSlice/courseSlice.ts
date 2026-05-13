import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import { TAllCoursesState, TCourse, TCourseState } from "./courseType";

export const useGetCoursesQuery = createQueryHook<TCourseState, TPagination>(
  ({ page, limit, search }) =>
    apiRequest<TCourseState>({
      url: `/course?page=${page}&limit=${limit}&search=${search}`,
      method: "GET",
    }),
);

export const useGetCourseQuery = createQueryHook<TCourseState<TCourse>, string>(
  (id) =>
    apiRequest<TCourseState<TCourse>>({
      url: `/course/${id}`,
      method: "GET",
    }),
);

export const useGetCoursesByUserQuery = createQueryHook<
  TAllCoursesState,
  string
>((id) =>
  apiRequest<TAllCoursesState>({
    url: `/course/user/${id}`,
    method: "GET",
  }),
);

export const useAddCourseMutation = createMutationHook<TCourseState, TCourse>(
  (data) =>
    apiRequest<TCourseState>({
      url: `/course`,
      method: "POST",
      body: data,
    }),
);

export const useUpdateCourseMutation = createMutationHook<unknown, any>(
  (data) =>
    apiRequest({
      url: `/course/${data._id}`,
      method: "PATCH",
      body: data,
    }),
);

export const useDeleteCourseMutation = createMutationHook<unknown, string>(
  (id) =>
    apiRequest({
      url: `/course/${id}`,
      method: "DELETE",
    }),
);
