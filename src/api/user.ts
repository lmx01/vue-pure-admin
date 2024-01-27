import { http } from "@/utils/http";

// export type UserResult = {
//   success: boolean;
//   data: {
//     /** 用户名 */
//     username: string;
//     /** 当前登陆用户的角色 */
//     roles: Array<string>;
//     /** `token` */
//     accessToken: string;
//     /** 用于调用刷新`accessToken`的接口时所需的`token` */
//     refreshToken: string;
//     /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
//     expires: Date;
//   };
// };

export type VerifyCodeResult = {
  k_error: number;
  msg: string;
  data?: {
    result: number;
    verify_id: string;
  };
};

export type LoginResult = {
  k_error: number;
  msg: string;
  data?: {
    left_days: number;
    result: number;
    sid: string;
    uid: number;
  };
};

export type UserResult = {
  k_error: number;
  msg: string;
  data: {
    result: number;
    profile: any;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/login", { data });
};

export const getVerifyCode = (phoneCode: string) => {
  return http.request<VerifyCodeResult>(
    "post",
    "/liao/v1/user/auth/get_verify_code",
    {
      data: {
        phone_code: phoneCode
      }
    }
  );
};

export const getLoginByPhone = (
  phoneCode: string,
  verifyCode: string,
  verifyId?: string
) => {
  return http.request<LoginResult>("post", "/liao/v1/user/login", {
    data: {
      phone_code: phoneCode,
      verify_code: verifyCode,
      verify_id: verifyId
    }
  });
};

export const getUserInfo = () => {
  return http.request<UserResult>("post", "/liao/v1/user/profile/get");
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};
