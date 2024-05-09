"use client";
import { gql, DocumentNode } from "@apollo/client";

export const REGISTER_USER: DocumentNode = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $name: String!
    $phone_number: Float!
  ) {
    register(
      registerDto: {
        name: $name
        phone_number: $phone_number
        email: $email
        password: $password
      }
    ) {
      activation_token
    }
  }
`;
