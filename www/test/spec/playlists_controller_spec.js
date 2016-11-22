/**
 * Created by Victor on 21/11/2016.
 */

'use strict';

describe('PlaylistsCtrl', function () {

  beforeEach(module('starter'));

  var PlaylistsCtrl, scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlaylistsCtrl = $controller('PlaylistsCtrl', {
      $scope: scope
    });
  }));

  /*it('should always fail', function () {
    expect(true).toBe(false);
  });*/
  it('should be connected to its view', function () {
    expect(scope.playlists).toBeDefined();
  });

});
