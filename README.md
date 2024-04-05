# Pygame Project

The deliverable for this project is to support three different Python experiences:

1. A standard Python terminal (using Python 3.10)
2. A Python terminal running Pygame connected to a display
3. A Python terminal running turtle connected to a display

The user will write their own code in the browser IDE, and then run the code in the respective environment. Up until now, we have used EC2 instances with an AutoScaling Group, but that setup is no longer sufficient for the amount of usage we have been experiencing. We have used Docker within EC2 instances and it works, but is not reliable and does not scale well. The browser would connect via websocket to a simple express server, which would then copy the code into a Docker environment and connect to the python shell using `node-pty`.

We are looking for a more scalable and reliable solution that provides a consistent experience for our users. The python terminal should connect and allow the user to run their file(s) every time. We also need the display to work correctly and show the output of pygame or turtle.

Providing a consistent user experience is most important, while also being cost effective.

## Existing setup

The existing frontend is built using Nuxt and Vue. The solution must interface with this frontend. The project provided is a simplified replica of our software, consisting of only the Editor, Python Terminal, and Display components. Some hard-coded values are included, ask any clarifying questions as needed. We are expecting to replace our existing backend setup for this project with an improved solution with different architecture. We can also make changes to the frontend as necessary, but plan to keep the structure and process similar.

The current project is attempting to connect a websocket to ws://localhost:8000

## Installation

Follow steps below to install and run the Nuxt/Vue project:

```bash
# install dependencies
npm ci

# start development server
npm run dev

# open browser to http://localhost:3000
```
