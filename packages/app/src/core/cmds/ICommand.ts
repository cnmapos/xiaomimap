import { Arg } from "../types";

export interface ICommand {
  id: string;
  execute: (...args: Arg[]) => void;
}
