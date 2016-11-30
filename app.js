(function() {
  'use strict';

  angular.module('NarrowItDownApp',[])
  .service('MenuSearchService', MenuSearchService)
  .controller('NarrowItDownController',  NarrowItDownController)
  .directive('foundItems',FoundItemsDirective);
  //.controller('FoundItemsDirectiveController', FoundItemsDirectiveController);

  function FoundItemsDirective(){
    var ddo={
       templateUrl:'foundItemDirective.html',
       scope:{
             found:'<',
             onRemove:'&'
       },
      controller :FoundItemsDirectiveController,
      controllerAs : 'fid',
      bindToController : true
    };
    return ddo;
  }

  function FoundItemsDirectiveController(){
    var directiveCtrl=this;
    console.log('directive ::fid.found',directiveCtrl.found);

  }

  NarrowItDownController.$inject=['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var search=this;
    search.searchTerm="";
    search.narrowItDown=function(){
      console.log("search.searchTerm::",search.searchTerm);
      MenuSearchService.getMatchedMenuItems(search.searchTerm).then(function(result){
        search.found=result;
        console.log("controller found Items Length::",search.found.length);
        console.log("controller found Items",search.found);
      });
    }

    search.remove=function(index){
      console.log("dontWantThisOne() called..");
      search.found.splice(index,1);
    }
    return search;
  }

  MenuSearchService.$inject=['$http','$q'];
  function MenuSearchService($http, $q){
      var deferred = $q.defer();
      var service=this;
      service.founditems=undefined;
      service.getMatchedMenuItems=function(searchTerm){
        service.searchTerm=searchTerm;
        $http({
         url : "https://davids-restaurant.herokuapp.com/menu_items.json",
         method: 'GET'
       }).then(function (result) {
              var menuItems= result.data.menu_items;
              var foundItems;
             console.log('menuItems.length',menuItems.length);
             console.log('Menu items',menuItems);

             foundItems=menuItems.filter(isMatchFound);
             deferred.resolve(foundItems);
             //console.log('foundItems',foundItems);
             // return processed items
             return foundItems;
       })
       .catch(function(error){
         deferred.reject("Some Error occurred");
       });
       return deferred.promise;
      }
      var isMatchFound=function(value){
        var match= (service.searchTerm!="" && value.description.toLowerCase().indexOf(service.searchTerm))>-1? true: false;
        //console.log(value.description, match);
        return match;
      }
}

}());
