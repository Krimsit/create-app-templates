#! /usr/bin/env node

import commander from "commander"
import chalk from "chalk"
import fs from "fs-extra"
import inquirer from "inquirer"
import { exec } from "child_process"

const cli_program = new commander.Command("Create App")

cli_program.version("1.0.0").description("123")

let template, language

const installDependencies = (name, template, language) =>
    new Promise((resolve, reject) => {
        console.log(chalk.blue("Installing dependencies..."))
        exec(`cd ${name} && npm i`, (initErr, initStdout, initStderr) => {
            if (initErr) {
                reject(err)
            } else {
                resolve("Installation of dependencies was successful")
            }
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

const getLanguage = (template) => {
    return template === "react" && "js, ts"
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
                ])
                .then((option) => {
                    template = option.template
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                name: "language",
                                message: `Choose language (${getLanguage(template)}): `,
                            },
                        ])
                        .then((option) => {
                            language = option.language
                            getTemplate(name, template, language)
                                .then((result) => {
                                    console.log(chalk.green(result))
                                    return installDependencies(name)
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
                })
        }
    })
})

cli_program.parse(process.argv)
