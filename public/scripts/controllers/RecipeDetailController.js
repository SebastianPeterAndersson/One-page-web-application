// A self invoking function so as to not clutter the global object:
(function(){
    // Bootstrapping the application:
    angular.module("app")
        // Calling controller
        .controller("RecipeDetailController", RecipeDetailController);
        // Controller function:
        function RecipeDetailController($scope, $location, dataService) {

            // –––––––––––––––––––––––––––––––
            //  State
            // –––––––––––––––––––––––––––––––

            // Show different things based on if we'd like to update a recipe or create a new one:
            function displayCondition() {
                return new Promise(function(resolve) {
                    var displayObj = {};
                    if ($location.url() == "/add") {
                        displayObj = {
                            h2: "Add New Recipe",
                            btn: "Add Recipe"
                        };
                    } else {
                        displayObj = {
                            h2: $scope.currentRecipe,
                            btn: "Update Recipe"
                        };
                    }
                    resolve(displayObj);
                });

            };

            // Initial state
            $scope.allGood = true;
            // Will be changed when the user clicks the 'add recipe button'
            // AND the user has provided insufficient information.
            // (This was not required to pass the project, so I have choosen to omit this.)

            // –––––––––––––––––––––––––––––––
            //  EVENT FUNCTIONS
            // –––––––––––––––––––––––––––––––

            // Redirection functions:
            $scope.changeURL = function(path){
                $location.url(path);
            };

            function redirectHome() {
                $location.url("/");
            }

            // Deletes the clicked step
            $scope.deleteStep = function(index) {
                // This promise will be called in the same function after completion,
                // the result will then be logged in the then-method.
                var del = new Promise(function(resolve, reject){
                    var resolveThis = {
                        splice: (function(){
                            var item = $scope.recipeObj.steps[index].description;
                            $scope.recipeObj.steps.splice(index, 1)
                            return "DELETED " + item;
                        }()),
                        index: index
                    }

                    resolve(resolveThis);

                    if(!index) {
                        reject("Cannot read value of " + index);
                    }
                });
                // When delete is finished:
                del.then(function(obj) {
                    console.log(obj.splice);
                });
            }

            // When a step text string is changed, change the Recipe model object step text
            $scope.stepChange = function(index){
                var text = this.currentText;
                $scope.recipeObj.steps[index].description = text;
            }

            // When the 'add another ingredient'-button is clicked, this function is fired:
            $scope.addIngredient = function() {
                $scope.recipeObj.ingredients.push({
                    foodItem: "",
                    condition: "",
                    amount: ""
                });
            }

            // When the 'add another step'-button is clicked, this function is fired:
            $scope.addStep = function() {
                $scope.recipeObj.steps.push({
                    description: ""
                });
            }


            // –––––––––––––––––––––––––––––––
            //  ASYNCHRONOUS FUNCTIONS
            // –––––––––––––––––––––––––––––––

            // This function returns a promise when it has found out what recipe ID is current, and, if there is one at all.
            function getRecipeID(){
                return new Promise(function(resolve) {
                    // Initialize an empty object model:
                    $scope.recipeObj = {};
                    // Determine what the current ID is:
                    $scope.recipeID = $location.url().slice(6);
                    // If there is a scope, resolve the ID, if not, resolve a false statement.
                    if ($scope.recipeID) {
                        resolve($scope.recipeID);
                    } else if (!$scope.recipeID){
                        resolve(false);
                    }
                });
            }

            // Now that we have a recipe ID in our promise chain, we can get the recipe itself.
                // if there is one that is. If not, create and resolve an empty object.
            function aquireRecipe(response) {
                return new Promise(function(resolve){
                    if (response === false) {
                        // Construct an empty object:
                        console.log("Constructing a new, empty object");
                        $scope.recipeObj = {
                                                name: "",
                                                description: "",
                                                category: "",
                                                prepTime: "",
                                                cookTime: "",
                                                category: "",
                                                cookTime: "",
                                                description:"",
                                                ingredients: [],
                                                name: "",
                                                prepTime: "",
                                                steps: [],
                                                _id: ""
                                            };
                                            resolve($scope.recipeObj);
                    } else {
                    dataService.getRecipeById(response, function(response){
                        // Construct an object out of the response:
                        console.log("Constructing an object out of the server's response");
                        $scope.currentRecipe = response.data.name;
                        var recipe = response.data;
                        $scope.recipeObj.name = recipe.name;
                        $scope.recipeObj.description = recipe.description;
                        $scope.recipeObj.category = recipe.category;
                        $scope.recipeObj.prepTime = recipe.prepTime;
                        $scope.recipeObj.cookTime = recipe.cookTime;
                        $scope.recipeObj.ingredients = recipe.ingredients;
                        $scope.recipeObj.steps = recipe.steps;
                        $scope.recipeObj._id = recipe._id;
                        // console.log($scope.recipeObj.ingredients);
                        resolve($scope.recipeObj);
                    });
                    }
                });
            }

            function assignH2AndBtn(res) {
                $scope.nameh2 = function(){
                    return res.h2;
                };
                $scope.nameBtn = function(){
                    return res.btn;
                };
            }

            // –––––––––––––––––––––––––––––––
            //  CONDITIONAL FUNCTI  ONS
            // –––––––––––––––––––––––––––––––

            // Return a truthy or falsy value depending on if there
            // is a ID in the url.
            function idExists() {
                return new Promise(function(resolve) {
                    if ($scope.recipeID) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            }

            // When clicking on '+ Save Recipe':
            $scope.addRecipe = function(){
                    idExists().then(function(result) {
                        var obj = $scope.recipeObj;
                        if (result === true) {
                            dataService.updateRecipeID($scope.recipeID, obj, function(response){

                            });
                            console.log("Recipe Updated");
                        } else {
                            dataService.saveRecipe(obj, function(response){

                            });
                            console.log("Recipe Added");
                        }
                    }).then(redirectHome);
            }

            // –––––––––––––––––––––––––––––––
            //  CATEGORY FUNCTIONS
            // –––––––––––––––––––––––––––––––

            function findCat(response){
                $scope.categories = response.data;
                // Logic to find the right category of the current recipe:
                $scope.matchedCategory = $scope.categories.findIndex(matchCategoryValues);
                var categoryIndex = $scope.matchedCategory;
                $scope.selected = $scope.categories[categoryIndex];
            }

            function matchCategoryValues(value) {
                return value.name === $scope.recipeObj.category;
            }

            $scope.catChange = function(val) {
                $scope.recipeObj.category = val;
                // console.log("Category changed to '" + val + "'");
            }

            dataService.getRecipeCategory(function(response){
                // console.log(response.data);
                $scope.recipeCategory = response.data;
            });



            dataService.getFoodItems(whenFoodItems);
            function whenFoodItems(response) {
                $scope.foodItems = response.data;
                // On event of clicking on the delete ingredient icon:
                $scope.deleteIngredient = function(index) {
                    var del = new Promise(function(resolve) {
                        var resolveThis = {
                            splice: (function() {
                                        var item = $scope.recipeObj.ingredients[index].foodItem;
                                        $scope.recipeObj.ingredients.splice(index,1);
                                        return item;
                                    }()),
                            index: index
                        }
                        resolve(resolveThis);
                    });

                    del.then(function(res){
                        // console.log("Deleted " + res.splice);
                    });
                }
            }

            // –––––––––––––––––––––––––––––––––––
            //  FIRING INITIAL ASYNCHRONOUS TASKS HERE:
            // –––––––––––––––––––––––––––––––––––
            getRecipeID().then(function(recipeID){
                aquireRecipe(recipeID).then(function(recipe){
                    $scope.recipeObj = recipe;
                    dataService.getCategories(findCat);
                    displayCondition().then(assignH2AndBtn);
                });
            });


        } // Controller Ends Here.



})();
