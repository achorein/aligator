'use strict';

class NavbarController {
  //start-non-standard
  menu = [
  {
    'title': 'Play',
    'state': 'play'
  },
  {
    'title': 'Info',
    'state': 'main'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor() {
    }
}

angular.module('aligatorApp')
  .controller('NavbarController', NavbarController);
