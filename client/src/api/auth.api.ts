/** @format */

// auth.api.ts
import { APIBase, OptionType } from "./APIBase";

type ResponseObject<T> = {
  limit: number;
  offset: number;
  total: number;
  results: T;
};

export default class A extends APIBase {
  constructor(init: OptionType) {
    super(init, "auth");
    this._name = "Auth";
    return this;
  }

  async login(args: {
    data: {
      email: string,
    password: string
    }
  }) {
    const res = await this.axios(
      {
        url: "/login",
        method: "post",
        data: args?.data
      },
      true
    );
    return res.data as ResponseObject<{}>;
  }

  async register(args: {
    data: {
      email: string,
      password: string,
      re_password: string,
      first_name: string,
      last_name: string
    }
  }) {
    const res = await this.axios(
      {
        url: "/register",
        method: "post",
        data: args?.data
      },
      true
    );
    return res.data as ResponseObject<{}>;
  }
}
