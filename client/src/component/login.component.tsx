/** @format */

import { useState, useRef, useEffect } from "react";
import { useApi } from "../api";
import Joi from "joi";

const Login = (props: { setView: (view: "login" | "register") => void }) => {
  const [fields, setField] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const api = useApi();
  const isMounted = useRef<boolean>(true)
useEffect(() => {
    if(!isMounted.current) isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])
  const handleChange = (field: string) => (e: any) => {
    const value = e.target.value;
    const newFields = { ...fields, [field]: value };
    setField(newFields);
  };

  

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const schema = Joi.object({
      email: Joi.string().email({tlds:{allow: false}}).required(),
      password: Joi.string().min(8).pattern(/[0-9A-Za-z_$#*]/).required(),
    });
    try {
      isMounted?.current && setIsLoading(true)
      const { error } = schema.validate(fields);
      
      if (Boolean(error)) {
        throw new Error(error?.message);
      }

      const res = await api.Auth.login({data: fields});
      // Set the new user session
      console.log({response: res})
    } catch (error) {
      console.error(error)
    }finally{
      isMounted?.current && setIsLoading(false)
    }
    
  };
  return (
          <form
          onSubmit={onSubmit}
          className="flex flex-col gap-[15px] p-[20px] boxed_layout"
          >
          <PageTitle>Login</PageTitle>
          <div className="flex flex-col gap-[8px]">
          <input
          onChange={handleChange("email")}
          placeholder="Email address"
          required
          type="email"
          />
          <input
          placeholder="Password"
          onChange={handleChange("password")}
          required
          type="password"
          />
          </div>
          <button
          type="submit"
          disabled={isLoading}
          className="text-center font-semibold p-[15px] bg-green-400 w-full text-gray-800"
          >
          {!isLoading ? "Login" : "Submitting..."}

          </button>
          <div className="flex flex-row gap-[8px]">
          Not a member?{" "}
          <span
          className="text-green-400 cursor-pointer"
          onClick={() => props?.setView("register")}
          >
          Create an account
          </span>
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
export default Login;
