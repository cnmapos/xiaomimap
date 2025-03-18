import { Arg } from "../types";
import { ICommand } from "./ICommand";

export class CommandRegistry {
  private static commands = new Map<string, ICommand>();

  static register(command: ICommand) {
    this.commands.set(command.id, command);
  }

  static unregister(commandId: string) {
    this.commands.delete(commandId);
  }

  static async execute(commandId: string, ...args: Arg[]) {
    const command = this.commands.get(commandId);
    if (command) {
      return await command.execute(...args);
    } else {
      console.warn(`Command not found: ${commandId}`);
    }
  }
}
