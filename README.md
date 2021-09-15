![Create-app-templates](https://raw.githubusercontent.com/Krimsit/create-app-templates/master/assets/logo.png)

![1631515941527.png](https://raw.githubusercontent.com/Krimsit/create-app-templates/master/assets/icon_npm.png) [NPM]("https://www.npmjs.com/package/create-app-templates")

---

### Install

`npm i -g create-app-templates` or `yarn add -g create-app-templates`

---

Creating app templates

`create-app-templates create app`

Next, you will be asked to select the template of which application you want to create (so far only react is available) and language (so far only js is available):

![choice of template and language.png](https://raw.githubusercontent.com/Krimsit/create-app-templates/master/assets/choice_of_template_and_language.png)

---

### Available templates and languages

Available templates:

-   react-js
-   react-ts

---

### Templates

React-js:

`create-app-templates create react_app`

This command with the choice of template react and js language will create a directory named `reactjs_app` inside the current folder. Inside this directory, it will generate the original project structure and install the transitive dependencies: This command will create a directory named `reactjs_app` inside the current folder. Inside this directory, it will generate the original project structure and install the transitive dependencies:

```
reactjs-app
    -dist
        index.html
    -src
        -components
        -container
        -modules
        -styles
        -utils
        App.jsx
        index.jsx
    package.json
    webpack.config.js
```

React-ts

When the project is created, enter the command:

`npm start` or `yarn start`

---

### Future

-   [ ] React-ts
-   [ ] Selecting additional dependencies
-   [ ] Choosing style preprocessor
-   [ ] Node Express-js
-   [ ] Node Express-ts
-   [ ] MERN-js
-   [ ] MERN-ts
