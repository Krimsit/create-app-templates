#! /usr/bin/env node

import commander from "commander"
import chalk from "chalk"
import fs from "fs-extra"
import inquirer from "inquirer"
import { exec } from "child_process"

const cli_program = new commander.Command("Create App")

cli_program.version("1.0.0").description("123")

const createPackageJSON = (name) =>
    new Promise((resolve, reject) => {
        console.log(chalk.blue("Create a package.json file..."))
        fs.readFile(`${name}/package.json`).then((file) => {
            const data = file.toString().replace('"test": "echo \\"Error: no test specified\\" && exit 1"', `"start": "webpack serve --mode development", "build": "webpack --mode production"`)
            fs.writeFile(`${name}/package.json`, data, (err) => (err ? reject(err) : resolve("package.json file created")))
        })
    })

const getDependencies = (template, language) =>
    new Promise((resolve, reject) => {
        console.log(chalk.blue("Get dependencies..."))
        resolve(
            template === "react" &&
                language === "js" && [
                    [
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
                    ["react", "react-dom", "styled-components", "classnames"],
                ]
        )
    })

const installDependencies = (name, template, language) =>
    new Promise((resolve, reject) => {
        getDependencies(template, language).then((dependencies) => {
            console.log(chalk.green("Dependencies successfully retrieved"))
            console.log(chalk.blue("Installing dependencies..."))
            exec(`cd ${name} && npm install --save-dev ${dependencies[0].join(" ")} && npm install --save ${dependencies[1].join(" ")}`, (initErr, initStdout, initStderr) => {
                if (initErr) {
                    reject(initErr)
                } else {
                    resolve("Installation of dependencies was successful")
                }
            })
        })
    })

const getTemplate = (name, template, language) =>
    new Promise((resolve, reject) => {
        console.log(chalk.blue("Copying additional files..."))
        exec(`cd ${name} && git clone https://github.com/Krimsit/create-templates`, (initErr, initStdout, initStderr) => {
            if (initErr) {
                reject(initErr)
            } else {
                fs.copy(`./${name}/create-templates/templates/${template}-${language}`, `./${name}`)
                    .then(() => resolve("Additional files copied"))
                    .catch((err) => reject(err))
            }
        })
    })

const clearCache = (name) =>
    new Promise((resolve, reject) => {
        console.log(chalk.blue("Deleting cache..."))
        fs.remove(`./${name}/create-templates`)
            .then(() => {
                resolve("Cache successfully deleted")
            })
            .catch((err) => reject(err))
    })

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
                    createPackageJSON(name)
                        .then((result) => {
                            console.log(chalk.green(result))
                            return installDependencies(name, option.template, option.language)
                        })
                        .then((result) => {
                            console.log(chalk.green(result))
                            return getTemplate(name, option.template, option.language)
                        })
                        .then((result) => {
                            console.log(chalk.green(result))
                            return clearCache(name)
                        })
                        .then((result) => {
                            console.log(chalk.green(result))
                        })
                        .then(() => {
                            console.log(chalk.green(`Project ${name} successfully created `))
                        })
                        .catch((err) => console.log(chalk.red(err)))
                })
        }
    })
})

cli_program.parse(process.argv)
