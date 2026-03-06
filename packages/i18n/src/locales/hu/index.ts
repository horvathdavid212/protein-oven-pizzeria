import { checkout } from "./checkout";
import { common } from "./common";
import { emails } from "./emails";
import { errors } from "./errors";
import { menu } from "./menu";
import { tracking } from "./tracking";

export const hu = {
  common,
  menu,
  checkout,
  tracking,
  errors,
  emails,
} as const;
