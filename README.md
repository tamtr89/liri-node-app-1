# Introducing **Liri**, the world's lamest personal assistant.

Why speak to a "smart" device, when you can whip open a terminal, navigate to the appropriate directory, make sure node is running and carefully type in the name of an application that you'll never remember?

---
## How to use Liri:

1. From within the liri directory, type `npm install` to make sure you have all the necessary packages. (See below for required packages.)
2. Type `node liri`.
2. Make a selection from the menu.
3. Clean up the floor after your mind has been blown.

---

## Screenshots
### Main menu

![Screenshot](https://justincone.github.io/liri-node-app/screen01.png)

### Spotify output (in green, naturally)

![Screenshot](https://justincone.github.io/liri-node-app/screen02.png)


## Required packages
Running `npm install` will take care of the necessary packages, but for reference's sake, here they are:

- [chalk](https://www.npmjs.com/browse/keyword/chalk) (add swanky colors to terminal output)
- [first-run](https://www.npmjs.com/package/first-run) (check if it's the first time the process is run)
- [inquirer](https://www.npmjs.com/package/inquirer) (create interactive prompts and menus)
- [node-spotify-api](https://www.npmjs.com/package/node-spotify-api) (Spotify API)
- [twitter](https://www.npmjs.com/package/twitter) (Twitter API)
- [request](https://www.npmjs.com/package/request) (make sexy HTTP calls)
