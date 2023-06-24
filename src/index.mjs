#!/usr/bin/env node
import Listr from "listr";
import chalk from "chalk";
import {glob} from "glob";
import {exec} from "child_process";

const packageJsonPaths = await glob("./**/package.json", {
    ignore: "**/node_modules/**",
});

const tasks = new Listr(packageJsonPaths.map(p => {
    const directoryPath = getDirectoryPaths(p);

    return {
        title: `Installing node_modules for directory: ${chalk.underline(p)}`,
        task: () => new Promise((resolve, reject) => {
            exec("npm install", {cwd: directoryPath}, (error) => {
                if (!error) {
                    resolve(`Successfully installed node_modules for directory: ${chalk.underline(p)}`);
                    resolve();
                } else {
                    reject(error);
                    reject(`Failed to install node_modules for directory: ${chalk.underline(p)}`);
                }
            });
        })
    }
}), {
    concurrent: true,
});

function getDirectoryPaths(packageJsonPath) {
    const pathParts = packageJsonPath.split("/");
    if (pathParts.length > 1) {
        pathParts.pop();
        return pathParts.join("/");
    }
    return '.';
}

tasks.run()
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
