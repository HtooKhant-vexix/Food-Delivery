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
import { ACTIVATE_USER } from "@/graphql/actions/activation.action";
import { useMutation } from "@apollo/client";
import { DialogClose } from "../components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

const Verification = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const formSchema = z.object({
    code: z.string().min(6),
  });
  //   console.log(DialogClose);

  const [ActivateUser, { loading, error, data }] = useMutation(ACTIVATE_USER);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const activationToken = localStorage.getItem("activatoin_token");
    console.log(values.code, activationToken);
    const data = {
      activationToken: activationToken,
      activationCode: values.code,
    };
    try {
      const response = await ActivateUser({
        variables: data,
      });
      toast({ description: "Account activated successfully!" });
      setActiveState("Login");
    } catch (err: any) {
      toast({ description: err.message });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="gap-3 text-primary">
                <FormLabel className="ms-2">Verification Code</FormLabel>
                <FormControl>
                  <Input
                    className="mt-2"
                    placeholder="Enter your code ..."
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

          <div className=" flex justify-between items-center">
            <Button
              type="submit"
              disabled={loading}
              className=" mt-2 w-full text-lg"
            >
              Comfirm
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Verification;
