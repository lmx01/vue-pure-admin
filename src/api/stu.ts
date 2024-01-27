import { http } from "@/utils/http";

type Result = {
  k_error: number;
  msg: string;
  data?: {
    len: number;
    /** 列表数据 */
    list: Array<any>;
  };
};

/** 卡片列表 */
export const getBookUserList = (data?: object) => {
  return http.request<Result>("post", "/liao/v1/class/student_list", { data });
};
