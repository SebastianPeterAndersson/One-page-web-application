(function(){
    "use strict";
    angular.module("app")
    .service("dataService", function($http){

        // Gets all of the recipes.
        this.getRecipes = function(callback){
            $http.get("api/recipes").then(callback);
        };

        // Gets all categories.
        this.getCategories = function(callback){
            $http.get("api/categories").then(callback);
        };

        // Gets all food items.
        this.getFoodItems = function(callback){
            $http.get("api/fooditems").then(callback);
        };

        // Gets all of the recipes for the specified category.
        this.getRecipeCategory = function(category, callback){
            $http.get("/api/recipes?category=" + category).then(callback);
        };

        // Gets the recipe for the specified ID.
        this.getRecipeById = function(id, callback){
            $http.get("/api/recipes/" + id).then(callback);
        };

        // PUT /api/recipes/{id} - Updates the recipe for the specified ID.
        this.updateRecipeID = function(id, data, callback) {
            $http.put("/api/recipes/" + id, data)
        }

        this.saveRecipe = function(data, callback) {
            $http.post("/api/recipes", data);
        }

        // this.addRecipe;

        this.deleteRecipe = function(id, callback){
            console.log("Removed recipe with ID " + id + " from the database.");
            $http.delete("api/recipes/" + id);
        };
    });
})();
