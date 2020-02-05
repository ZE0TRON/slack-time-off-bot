## Slack Time Off Bot

A time off bot for slack teams.

## Features

* Team members can create/delete time off policies.


  ```/tob create_policy```

  ```/tob delete_policy```
* Team members can request/cancel time offs.
  
  ```/tob request```

  ```/tob cancel```

* Weekly time off announcement at the beginning of the week.
* Team members can list this weeks
  
  ```/tob list```

## Usage
```shell 
git clone
```
```shell 
npm install
```
Create a .env.dev file with properties
```shell
VERIFICATION_TOKEN=
TOKEN=
MONGO_URL=
```
Configure your slack applications urls
- interactivity = \<server\>/api/interactivity
- slashCommands = \<server\>/api/commands
```shell 
npm run start
```
