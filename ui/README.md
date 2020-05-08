# Monorepo with yarn workspaces

The frontend part of the cap project is now architectured as a monorepo.


## Details about the structure
The current structure of the app now is:
```
├── cap-react
├── forms-playground
├── node_modules
├── package.json
└── yarn.lock
```



The main app is under the directory `ui/cap-react`
The forms-playground directory represent sibling project listed as workspaces.

In this directory there is a `package.json` file with information:
```
{
    "private": true,
    "name":"cap-project",
    "workspaces":["cap-react", "forms-playground"],
    "scripts": {
        "cap":"yarn workspace cap-react start",
        "forms":"yarn workspace forms-workspace start"
    }
}
```

#### Important note regarding installation
It is advised by yarn workspaces to run the command `yarn install` in the root folder of the ui and not inside any workspace directory in order to avoid potential inconsistences. Despite that, when a new package needs to be installed then the command will run inside the workspace directory.

#### Init the workspaces
- From the ui root directory. The generic `package.json` provides commands in order to run workspaces from the root directory and start the projects. It depends on the developer's preference from which directory wants to init the project. For example, in the ui directory, you have to run `yarn cap` in order to start the project of `cap-react`. 
- From the workspace directory. Developers can run the command `yarn start` to start the project.

#### Link among siblings
Adding a workspace as a dependency will provide access to its components from another workspace. 
For example, the `forms-playground` workspace will add the `cap-react` as dependency and then it will be able to access the components by importing them.

- Forms-playground `package.json`
```
{
  "name": "forms-playground",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    ......,
    .......,
    "cap-react":"0.1.0",
    .........,
  },
  "scripts": {
    "start": "react-app-rewired start",
```

- import components from the `cap-react` project
```
import Form from "cap-react/src/components/drafts/form/Form";
```

#### Why monorepos
- Share code easily among workspaces
- Create one `node_modules` folder on the root directory and share it among the workspaces