# Crisis App

## Project setup

Set the FontAwesome Pro key before installing for the first time, (or you'll get a 402 error)
```
export FONTAWESOME_NPM_AUTH_TOKEN=52C3C4EB-94B3-442A-86CC-32A7B3E9D3CB
yarn install
```

Note: this is Derwent's key who has a license, just don't share this elsewhere or make this repo public. (oh shit it's public, oh well.)

## Setup Database

```bash
cd sql
INGESTOR_SQL_PASS="foo" CRISISAPP_SQL_PASS="bar" ./populate_setup.sh
mysql -u root setup.sql
```

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
