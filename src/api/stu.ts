import { http } from "@/utils/http";

type Result = {
  k_error: number;
  msg: string;
  len: number;
  data?: Array<any>;
};

/** 卡片列表 */
export const getBookUserList = (data?: object) => {
  return http.request<Result>("post", "/liao/v1/class/student_list", { data });
};
