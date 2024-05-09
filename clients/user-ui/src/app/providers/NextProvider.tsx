"use client";
import { graphqlClient } from "@/graphql/gql.setup";
import { ApolloProvider } from "@apollo/client";
import React from "react";

const NextProvider = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>;
};

export default NextProvider;
