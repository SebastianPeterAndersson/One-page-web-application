(function(){
    "use strict";

    angular.module("app")

        .controller("RecipesController", RecipesController);

        function RecipesController($scope, $location, $route, dataService){

        // STATES

            // Determines whether the "all recipes" tab is selected:
            $scope.isOnAll = true;

            $scope.recipesFound = true;

            // $scope.optionSelected = false;

            function redirectHome() {
                $location.path("/");
                $scope.$apply();
                console.log("change url");
            }

        // Methods:

        // This function stops the process of deleting a recipe:
        function beforeDeleting(){
            return new Promise(function(resolve) {
                $scope.beforeDeleting = true;
                resolve(redirectHome);
            });
        }

        function chooseMe(data) {
            return new Promise(function(resolve) {

                $scope.clickGreen = function(){
                    console.log("'Yes' clicked");
                    $scope.beforeDeleting = false;
                    resolve(data);
                };

                $scope.clickRed = function(){
                    console.log("'No' clicked");
                    $scope.beforeDeleting = false;
                    resolve("red");
                };
            });


        }


            // Change the url to the specified parameter
            $scope.changeURL = function(path){
                $location.url(path);
            };
            // ––––––––––––––––––––––––––––––––
            //  PROMISE CHAIN:
            // ––––––––––––––––––––––––––––––––
            $scope.deleteRecipe = function(recipeID) {
                beforeDeleting().then(chooseMe).then(function(res) {
                    console.log(res);
                    // If the user clicks on 'no':
                    if (res === "red") {
                    // If the user clicks on 'yes':
                    } else {
                        console.log(res);
                        // Delete the recipe with blackbox:
                        dataService.deleteRecipe(recipeID, function(){
                        });
                    }
                // Then call a callback that directs home:
                }).then(redirectHome);

            };

            // Gets  the current recipe category value by extracting information from the category object.name object.
            $scope.getRecipeByCategory = function(currentCat) {

                var recipe;

                dataService.getRecipeCategory(currentCat, function(response){
                    if (currentCat == null) {
                        // Assign $scope.allRecipes information to the recipe variable;
                        recipe = $scope.allRecipes;
                        // Give the angular scope variable the variable's information:
                        $scope.recipes = recipe;
                        // State that the recipesFound state tracker is now true:
                        $scope.recipesFound = true;

                        $scope.isOnAll = true;
                        return;
                        // State that tracks if the
                    }

                    $scope.isOnAll = false;
                    console.log("CURRENT CAT:", currentCat);
                    recipe = response.data;
                    console.log("array with recipes ––> ", recipe);
                    $scope.recipes = recipe;
                    //  If there are:
                    if (response.data.length === 0) {
                        //option 1: no recipes now, state that no recipes where found in the tracking of the recipes:
                        $scope.recipesFound = false;
                    } else {
                        //option 2: recipes now, state that recipes has been found in tracking of the recipes:
                        console.log("asdasd OSSSJDD");
                        $scope.recipesFound = true;
                    }
                });
            };

            // –––––––––––––––––––––––––––––––
            //  GET STUFF FROM THE DATABASE
            // –––––––––––––––––––––––––––––––

            dataService.getCategories(function(response){
                // console.log(response.data);
                $scope.categories = response.data;
            });

            dataService.getRecipes(function(response){
                // console.log(response.data);
                $scope.recipes = response.data;
                $scope.allRecipes = response.data;
            });

            dataService.getFoodItems(function(response){
                // console.log(response.data);
                $scope.foodItems = response.data;
            });

            dataService.getRecipeCategory(function(response){
                // console.log(response.data);
                $scope.recipeCategory = response.data;
            });
        }
})();
