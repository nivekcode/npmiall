// #!/usr/bin/env node
import ora from "ora";
import chalk from "chalk";
import { glob } from "glob";
import { exec } from "child_process";

const packageJsonPaths = await glob("./**/package.json", {
  ignore: "**/node_modules/**",
});

let processes = [];

packageJsonPaths.forEach((packageJsonPath) => {
  const process = new Promise((resolve, reject) => {
    const pathParts = packageJsonPath.split("/");
    pathParts.pop();
    const directoryPath = pathParts.join("/");

    const spinner = ora(
      chalk.blue(
        `Running npm install for directory ${chalk.underline(packageJsonPath)}`
      )
    );
    spinner.start();

    exec("npm install", { cwd: directoryPath }, (error) => {
      if (!error) {
        spinner.succeed();
        resolve();
      } else {
        reject(error);
        spinner.fail(error.toString());
      }
    });
  });
  processes.push(process);
});

await Promise.all(processes)
  .then(() => {
    console.log(
      chalk.green.underline(
        "👷 node_modules successfully installed for all directories!"
      )
    );
  })
  .catch((error) => {
    console.log(chalk.red.underline("👷 oops! something went wrong!"));
    console.log(chalk.red(error));
  });
