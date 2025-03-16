import { Arg } from "../types";

export enum CommandIds {
  TRACE_ANIMATION_GENERATION = "trace_animation_generation",
}

export enum CommandStatus {
  SUCCESS = 0,
  FAILURE = 1,
}

export interface CommandResponse {
  status: CommandStatus;
  message?: string;
  data: any;
}

export interface ICommand {
  id: string;
  execute: (...args: Arg[]) => Promise<CommandResponse>;
}
