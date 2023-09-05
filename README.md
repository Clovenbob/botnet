
# Botnet

a botnet for Hypixel.

## Features

- Auto reconnect
- Multiple accounts
- In-game party command system
- Auto join limbo/skyblock/housing
- Auto match housing servers (mini123ABC)
- Discord webhooks (WIP)
- and more!
## Commands

- (username) command: Runs the command for one account instead of all.
- logout: Logs all accounts out and exits the program. (unless using -noexit)
- restart: Restart the program.
- reparty: Reparties all the bots.
- limbo: Switch the task to limbo.
- skyblock: Switch the task to skyblock.
- reward: Claim the daily reward.
- home (house name | number): Switch the task to home.
- match (server1, server2, server3): Tries to match the server.
- endmatch: Stop trying to match the server.
- chat (message): Sends a message in chat.
- account (username): Switch the account controlling the botnet.
- view: Change the account that is logging chat to the console.

## Installation

Clone the project

```
git clone https://github.com/clovenbob/botnet
```
Fill in ```config.json``` and ```accounts.json``` with your information

Install dependencies

```
npm install
```

Build the project

```
npm run build
```
Run the project

```
npm run start
```


## FAQ

#### How do I delete my account credentials?

After you remove the information from the accounts.json file, navigate to your ```.minecraft``` folder and delete ```.nmp-cache```

#### Why isn't the bot partying me/doing tasks correctly?

Make sure your Hypixel language is set to English and you have chat turned on (/togglechat)

#### Why does the house matching feature not work?

For the housing matching feature to work, your houses must be named 001-999

#### I need more help!

Feel free to ask for help in my [discord](https://discord.gg/qjW9KzXgss)!