# Task

Create a world time zone converter

## Requirements:

 - Initial page should have two time zones, 1 for the users current time zone and one for GMT time
 - The user should be able to add new timezones to the list of time zones and show the current time in each zone
 - The user should be able to enter any time for each of the listed time zones and it will automatically show what that time is in the other time zones.
 - It should work on a modern web browser and exhibit some form of responsive design. It’s up to you how you choose to demonstrate this.

## Testing:

Please include test cases for the core of your solution. Test cases should utilize an existing Angular testing framework.

## What’s not important:

Don’t focus on beautiful UI. We are primarily interested in your Angular solution. Remember this is an Angular test, so we will be paying attention to your use of Angular core concepts.

# Solution

## Overview

1. Used moment.js and moment.js timezone for dates manipulations
1. Used service as central component for date synchronization
1. Used directive as primary component, holding date/time and timezone info
1. Synchronization between all components is done through $broadcast. Although this could be improved in order to minimize scopes affected by broadcast.
1. If dates needs to behave as clock (ticks) it can be easily achieved by modyfing service (adding $interval)
1. RWD demonstration is simple: for mobile devices there is only one column, for larger screens there is to columns

## Dev setup

1. Install node.js, npm, grunt, bower
1. npm install
1. bower install
1. grunt serve to launch local version

### Testing

1. `grunt karma:unit`
1. `grunt test:e2e`

## Deployment

See https://calm-retreat-8123.herokuapp.com/

In order to build and deploy on heroku:
```
grunt
cd dist
git push heroku
```