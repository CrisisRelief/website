# Crisis App

## Project setup
```
yarn install
```

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
