import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";
import { NOT_AUTH_ERROR } from "../constants";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error(NOT_AUTH_ERROR);
  }
  return next();
};
