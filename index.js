#! /usr/bin/env node

import commander from "commander"
import chalk from "chalk"
import fs from "fs-extra"
import inquirer from "inquirer"
import { exec } from "child_process"

const cli_program = new commander.Command("Create App")

cli_program.version("1.0.0").description("123")

const getDependencies = (template, language) => {
    console.log(chalk.blue("Get dependencies..."))
    return (
        template === "react" &&
        language === "js" && [
            ([
                "webpack",
                "webpack-cli",
                "@babel/core",
                "babel-loader",
                "@babel/preset-env",
                "@babel/preset-react",
                "style-loader",
                "css-loader",
                "less-loader",
                "postcss-loader",
                "file-loader",
                "html-webpack-plugin",
                "eslint-webpack-plugin",
            ],
            ["react", "react-dom", "styled-components", "classnames"]),
        ]
    )
}

const getTemplate = (template, language) => {
    console.log(chalk.blue("Copying additional files..."))
    exec(`git clone https://github.com/Krimsit/create-templates`, (initErr, initStdout, initStderr) => {
        if (initErr) {
            console.log(chalk.red(initErr))
        } else {
            fs.copy(`./create-template-master/templates/${template}-${language}`, `./`)
                .then(() => console.log(chalk.green("Additional files copied")))
                .catch((err) => console.error(chalk.red(err)))
        }
    })
}

const clearCache = () => {
    console.log(chalk.blue("Deleting cache..."))
    exec(`rm -rf ./create-template-master`, (initErr, initStdout, initStderr) => {
        if (initErr) {
            console.error(chalk.red(initErr))
        } else {
            console.log(chalk.green("Cache successfully deleted"))
        }
    })
}

cli_program.command("create <name>").action((name, cmd) => {
    exec(`mkdir ${name} && cd ${name} && npm init -f`, (initErr, initStdout, initStderr) => {
        if (initErr) {
            console.error(chalk.red(initErr))
        } else {
            console.log(chalk.blue("Initializing project..."))
            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "template",
                        message: "Choose a template type (react): ",
                    },
                    {
                        type: "input",
                        name: "language",
                        message: "Choose language (js): ",
                    },
                ])
                .then((option) => {
                    console.log(chalk.blue("Create a package.json file..."))
                    fs.readFile(`${name}/package.json`).then((file) => {
                        const data = file
                            .toString()
                            .replace('"test": "echo \\"Error: no test specified\\" && exit 1"', `"start": "webpack serve --mode development", "build": "webpack --mode production"`)
                        fs.writeFile(`${name}/package.json`, data, (err) => (err ? console.error(chalk.red(err)) : console.log(chalk.green("package.json file created"))))
                    })
                    const dependencies = getDependencies(option.template, option.language)
                    console.log(chalk.green("Dependencies successfully retrieved"))
                    console.log(chalk.blue("Installing dependencies..."))
                    exec(`cd ${name} && npm install --save-dev ${dependencies[0].splice(" ")} && npm install --save ${dependencies[1].splice(" ")}`, (initErr, initStdout, initStderr) => {
                        if (initErr) {
                            console.error(chalk.red(initErr))
                        } else {
                            console.log(chalk.green("Installation of dependencies was successful"))
                        }
                    })
                    getTemplate(option.template, option.language)
                    clearCache()
                    console.log(chalk.green(`Project ${name} successfully created `))
                })
        }
    })
})

cli_program.parse(process.argv)
