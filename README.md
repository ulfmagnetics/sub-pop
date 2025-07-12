# sub pop - a subscription tracker

## What is this?

How much am I spending on all of these subscriptions, anyway? I don't even know
any more. There are a bunch of streaming services (video and audio), some Substacks
and Patreons, a couple of IRL magazines, some video game premium services, god I don't
even know what else. I feel like I'm spending a bunch of money and not getting as much
value as I should!

Sub Pop is a dumb little subscription tracker with the goal of helping to solve that
problem. It is very much a work in progress.

It's built with Vue.js. The technical details are below.

## How can I use this?

There's a demo installation hosted on Github Pages at https://ulfmagnetics.github.io/sub-pop.
Unfortunately I haven't implemented registration yet (see TODO) but if you really want access,
get in touch and I can create an account for you manually!

## TODO

- Authentication
  - Add a registration page
  - Add an account section with support for updating passwords, forgot password, etc.


## Configuring your development environment 

### Set required environment variables

Create a file called `.env.local` and provide values for the following three variables
based on your AWS configuration:

```
VUE_APP_COGNITO_USER_POOL_ID=your_cognito_user_pool_id
VUE_APP_COGNITO_CLIENT_ID=your_cognito_client_id
VUE_APP_API_URL=your_api_gateway_invoke_url
```

### Install dependencies

```
npm install
```

### Run the development server

```
npm run serve
```