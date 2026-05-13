import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "@/features/employee/api";
import { TPagination } from "@/types";

export type TCourseItem = {
  name: string;
  price: number;
  currency: string;
  users: string[];
  purchase_date?: Date;
  expire_date?: Date;
};

export type TCourse = {
  _id?: string;
  platform: string;
  website: string;
  email: string;
  password: string;
  courses: TCourseItem[];
  createdAt?: Date;
};

export type TCourseState<T = TCourse[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

export type TAllCoursesState = {
  success: boolean;
  message: string;
  result: (TCourseItem & {
    platform: string;
    website: string;
    email: string;
    password: string;
  })[];
};

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
