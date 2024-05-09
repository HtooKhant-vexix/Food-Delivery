"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import Link from "next/link";
import google from "../../assets/google.png";
import git from "../../assets/code.png";
import Image from "next/image";
import { DialogClose } from "../components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/graphql/actions/login.action";
import { toast } from "@/components/ui/use-toast";

const Login = ({
  setActiveState,
  close,
}: {
  setActiveState: (e: string) => void;
  close: (e: boolean) => void;
}) => {
  const formSchema = z.object({
    email: z.string().min(2).max(50),
    password: z.string().min(8).max(50),
  });
  console.log(close, "ljlkjljlkjljjljjljk");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [LoginUser, { loading, error, data }] = useMutation(LOGIN_USER);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const response = await LoginUser({
        variables: values,
      });
      toast({
        description: "Account Login Successfully!",
      });
      close(false);
    } catch (err: any) {
      toast({
        description: err.message,
      });
    }
  };

  console.log(DialogPrimitive.DialogClose);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="gap-3 text-primary">
                <FormLabel className="ms-2">Email</FormLabel>
                <FormControl>
                  <Input
                    className="mt-2"
                    placeholder="Enter your email ..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {/* <FormLabel className="ms-2">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2"
                      placeholder="Enter your password ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage /> */}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="gap-3 text-primary">
                <FormLabel className="ms-2">Password</FormLabel>
                <FormControl>
                  <Input
                    className="mt-2"
                    placeholder="Enter your password ..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" flex justify-between items-center">
            <div className="text-sm ps-2 mt-2 gap-2 flex text-primary/80">
              forget password ?
              <div
                onClick={() => setActiveState("Signup")}
                // onClick={() => close(false)}
                className=" text-secondary cursor-pointer select-none"
              >
                click here
              </div>
              .
            </div>
            <Button type="submit" disabled={loading} className=" mt-2  text-lg">
              Sign in
            </Button>
          </div>
          <div className="gap-2">
            <Button className="py-6 w-full mt-2" variant={"outline"}>
              <Link href="/" className="flex gap-4 items-center">
                <Image alt="err" width={28} src={google} /> Sign in with google
              </Link>
            </Button>
            <Button className="py-6 w-full mt-2" variant={"outline"}>
              <Link href="/" className="flex gap-4 items-center">
                <Image alt="err" width={28} src={git} /> Sign in with github
              </Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <div className="text-sm ps-2 mx-auto gap-2 cursor-pointer mt-2 flex text-primary/80">
              Not have any account,
              <div
                onClick={() => setActiveState("Signup")}
                className=" text-secondary selected-none "
              >
                sign up
              </div>
              .
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
