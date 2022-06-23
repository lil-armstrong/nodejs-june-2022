/** @format */
import React, { useEffect,useRef, useState } from "react";
import { useApi } from "../api";
import Joi from "joi";

const Register = (props: { setView: (view: "login" | "register") => void }) => {
  const api = useApi();
  const [fields, setField] = useState({
    email: "",
    password: "",
    re_password: "",
    first_name: "",
    last_name: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true)
  useEffect(() => {
    if(!isMounted.current) isMounted.current = true
      return () => {
        isMounted.current = false
      }
    }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const schema = Joi.object({
      email: Joi.string().email({tlds:{allow: false}}).required(),
      password: Joi.string().min(8).pattern(/[0-9A-Za-z_$#*]/).required(),
      re_password: Joi.string().valid(Joi.ref("password")).required(),
      first_name: Joi.string().required().min(2),
      last_name: Joi.string().required().min(2)
    });
    try {
      isMounted?.current && setIsLoading(true)

      const { error } = schema.validate(fields);
      
      if (Boolean(error)) {
        throw new Error(error?.message);
      }

      const res = await api.Auth.register({data: fields});
      // Set the new user session
      console.log({response: res})
    } catch (error) {
      console.error(error)
    }finally{
      isMounted?.current && setIsLoading(false)
    }
    
  };
  const handleChange = (field: string) => (e: any) => {
    const value = e.target.value;
    const newFields = { ...fields, [field]: value };
    setField(newFields);
  };
  return (
          <form
          onSubmit={onSubmit}
          className="flex flex-col gap-[15px] p-[20px] boxed_layout"
          >
          <PageTitle>Register</PageTitle>
          <div className="flex flex-col gap-[8px]">
          <input
          onChange={handleChange("email")}
          placeholder="Email address"
          type="email"
          />
          <input
          onChange={handleChange("password")}
          placeholder="Password"
          type="password"
          />
          <input
          onChange={handleChange("re_password")}
          placeholder="Confirm password"
          type="password"
          />
          <input
          onChange={handleChange("first_name")}
          placeholder="First name"
          type="text"
          />
          <input
          onChange={handleChange("last_name")}
          placeholder="Last name"
          type="text"
          />
          <button
          type="submit"
          disabled={isLoading}
          className="text-center font-semibold p-[15px] bg-green-400 w-full text-gray-800"
          >
          {!isLoading ? "Create account" : "Submitting..."}
          </button>
          <div className="flex flex-row gap-[8px]">
          Already a member?{" "}
          <span
          className="text-green-400 cursor-pointer"
          onClick={() => props?.setView("login")}
          >
          Login to account
          </span>
          </div>
          </div>
          </form>
          );
};
const PageTitle: React.FC<{}> = (props) => {
  return (
          <h2 className="block text-xl font-semibold text-center">
          {props?.children}
          </h2>
          );
};
export default Register;
