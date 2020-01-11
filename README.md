# Crisis App

## Project prerequisites

To run this project locally first you will need to install:

- [Yarn](https://yarnpkg.com/lang/en/docs/install/)

## Project setup

Set the FontAwesome Pro key before installing for the first time, (or you'll get a 402 error)
```
export FONTAWESOME_NPM_AUTH_TOKEN=[value from Slack Dev chan]
yarn install
```

Note: this is Derwent's key who has a license, just don't share this elsewhere or make this repo public. (oh shit it's public, oh well.)

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Contributing

- Please pick a card from the current sprint in [JIRA](https://firemap.atlassian.net/secure/RapidBoard.jspa?rapidView=3&projectKey=CAD&view=planning&issueLimit=100).
- If you create a new ticket in JIRA and it's a development ticket, remember to set the `development` label.
- We are doing [feature branching](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) so your branch name should be `CAD-XX`
- All commits should pass `yarn lint` before pushing (or the pipeline will fail)
- Commit messages should ideally be `[CAD-XX][<NAME>]<GITMOJI> what you did`. E.g.: `[CAD-66][Derwent] 🚲 Bye, SQL!`
- [Gitmoji reference here](https://gitmoji.carloscuesta.me/) and [here](https://kapeli.com/cheat_sheets/Gitmoji.docset/Contents/Resources/Documents/index) - please copy the unicode gitmoji from the second guide, not just `:emoji:`
- When you've submitted a PR, set the status of the ticket to `Review` and ask for a reviewer
- When someone has merged the PR into master, check that it passes all of the tests in [the pipeline](https://github.com/CrisisRelief/website/actions) and deploys to prod.
- Only then, can you set it to done.
