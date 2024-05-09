"use client";
import { useToast } from "@/components/ui/use-toast";
import React from "react";
import { number, z } from "zod";
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
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "@/graphql/actions/register.action";

const Register = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const { toast } = useToast();

  const [registerUserMutation, { loading, error, data }] =
    useMutation(REGISTER_USER);

  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 3 characters long"),
    email: z.string().min(2).max(30),
    password: z.string().min(8, "Password must be at least 8characters long"),
    phone_number: z
      .number()
      .min(8, "phone number must be at least 11 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await registerUserMutation({
        variables: data,
      });
      console.log(response.data.register.activation_token);
      toast({
        description: "Please check your email to activate your account.",
      });
      localStorage.setItem(
        "activatoin_token",
        response.data.register.activation_token
      );
      setActiveState("Verification");
    } catch (err: any) {
      toast({ description: err.message });
    }

    // console.log(values);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="gap-3 text-primary">
                <FormLabel className="ms-2">Username</FormLabel>
                <FormControl>
                  <Input
                    className="mt-2"
                    placeholder="Enter your username ..."
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
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem className="gap-3 text-primary">
                <FormLabel className="ms-2">Phone number</FormLabel>
                <FormControl>
                  <Input
                    type={"number"}
                    className="mt-2"
                    placeholder="Enter your phone number ..."
                    {...form.register("phone_number", {
                      valueAsNumber: true,
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" flex justify-between items-center">
            <div className="text-sm ps-2 gap-2 mt-2 flex text-primary/80">
              Not have any account ,
              <div
                onClick={() => setActiveState("Login")}
                className=" text-secondary cursor-pointer selected-none "
              >
                Login
              </div>
              .
            </div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || form.formState.isLoading}
              className=" mt-2 text-lg"
            >
              Sign up
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
        </form>
      </Form>
      {/* <Button
        variant="outline"
        onClick={() => {
          toast({
            description: "Your message has been sent.",
          });
        }}
      >
        Show Toast
      </Button> */}
    </div>
  );
};

export default Register;
