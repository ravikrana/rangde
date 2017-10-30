'use strict';

describe('controller: MainController', function() {
  var ctrl, gameService, $scope;

  beforeEach(module('webApp'));


  it('should call gameService', function() {
    expect(gameService.getGameCollection().toHaveBeenCalled());
 
  });


});