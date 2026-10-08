declare const require: any;
const fs = require("fs");
const path = require("path");

export abstract class DirectoryProcessor {
  private dirName: string;
  private fileRegExp: RegExp;
  private recurse: boolean;

  protected constructor(
    dirName: string,
    filePattern: string,
    recurse: boolean = false
  ) {
    this.dirName = dirName;
    this.fileRegExp = new RegExp(filePattern);
    this.recurse = recurse;
  }

  public async run(): Promise<void> {
    await this.processDirectory(this.dirName);
    this.printSummary();
  }

  protected abstract processFile(filePath: string): Promise<void>;

  protected abstract printSummary(): void;

  private async processDirectory(dirName: string): Promise<void> {
    if (!this.isDirectory(dirName)) {
      console.log(`${dirName} is not a directory`);
      return;
    }

    if (!this.isReadable(dirName)) {
      console.log(`Directory ${dirName} is unreadable`);
      return;
    }

    const files = fs.readdirSync(dirName);

    for (const file of files) {
      const fullPath = path.join(dirName, file);
      if (this.isFile(fullPath)) {
        if (this.isReadable(fullPath)) {
          if (this.fileRegExp.test(fullPath)) {
            await this.processFile(fullPath);
          }
        } else {
          this.unreadableFile(fullPath);
        }
      }
    }

    if (this.recurse) {
      for (const file of files) {
        const fullPath = path.join(dirName, file);
        if (this.isDirectory(fullPath)) {
          await this.processDirectory(fullPath);
        }
      }
    }
  }

  private isDirectory(filePath: string): boolean {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (error) {
      return false;
    }
  }

  private isFile(filePath: string): boolean {
    try {
      return fs.statSync(filePath).isFile();
    } catch (error) {
      return false;
    }
  }

  private isReadable(filePath: string): boolean {
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  private unreadableFile(filePath: string): void {
    console.log(`File ${filePath} is unreadable`);
  }
}
