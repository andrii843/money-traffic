$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});



angular.module("money", ['ngRoute','ngCookies'])

    .config(["$httpProvider", function($httpProvider) {
        //$httpProvider.defaults.headers.common["X-CSRFToken"] = window.csrf_token;

        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])

    //Забираєм %2F та # з url сайту
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode(true);
    }])

    .config(function ($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: '/static/tmpl/page-main.html',
            controller: 'MoneyCtrl'
        })    


        .when('/add-save', {
            templateUrl: '/static/tmpl/page-new-save.html',
            controller: 'MoneyCtrl'
        })  

        .when('/add-category', {
            templateUrl: '/static/tmpl/page-new-category.html',
            controller: 'MoneyCtrl'
        })  

        .when('/add-source', {
            templateUrl: '/static/tmpl/page-new-source.html',
            controller: 'MoneyCtrl'
        })  

        .when('/history', {
            templateUrl: '/static/tmpl/page-history.html',
            controller: 'MoneyCtrl'
        })    

        .when('/income', {
            templateUrl: '/static/tmpl/page-income.html',
            controller: 'MoneyCtrl'
        })    


        .when('/outcome', {
            templateUrl: '/static/tmpl/page-outcome.html',
            controller: 'MoneyCtrl'
        })    


        .otherwise({
            redirectTo: '/'
        });
    })

    // .run( function run($http, $cookies ){
    //     // titleService.setSuffix( '[title]' );
    //     // For CSRF token compatibility with Django
    //     $http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
    // })    

    // Головний контроллер на сторінці
    .controller("MoneyCtrl", function($scope, $http) {
    
        $scope.user_is_auth = true;

        $scope.hide_all_forms = function(){
            $scope.display_save_form = false;
            $scope.display_source_form = false;
            $scope.display_category_form = false;
            $scope.display_income_form = false;
            $scope.display_outcome_form = false;
        }








        // Отримуємо інформацію про користувача, якщо користувач не залогований, 
        // то переходимо на сторінку авторизації
        $scope.update_user_info = function(){
            $http.get('/api/user/')
                .then(function successCallback(response) {
                    $scope.user = response.data;

                    if($scope.user.is_auth == true) {
                        $scope.user_is_auth = true;

                        console.log($scope.user)


                    } else {
                        $scope.user_is_auth = false;
                    }

                }, function errorCallback(response) {
                    console.log("Error!!!" + response.err);
                    $scope.user_is_auth = true;
                });
        }


        $scope.get_sources = function(){
            $http.get('/api/sources/')
                .then(function successCallback(response) {
                    $scope.sources = response.data;
                }, function errorCallback(response) {
                    console.log("Error!!!" + response.err);
                });
        }

        $scope.get_categories = function(){
            $http.get('/api/categories/')
                .then(function successCallback(response) {
                    $scope.categories = response.data;
                    console.log('Категорії оновлені');
                }, function errorCallback(response) {
                    console.log("Error!!!" + response.err);
                });
        }        

        $scope.get_saves = function(){
            $http.get('/api/saves/')
                .then(function successCallback(response) {
                    $scope.saves = response.data;
                }, function errorCallback(response) {
                    console.log("Error!!!" + response.err);
                });
        }           


        $scope.get_history = function(){
            $http.get('/api/history/')
                .then(function successCallback(response) {
                    $scope.history = response.data;
                }, function errorCallback(response) {
                    console.log("Error!!!" + response.err);
                });
        }            


        $scope.init = function() {
            $scope.update_user_info();
            $scope.get_sources();
            $scope.get_saves();
            $scope.get_categories();   
            $scope.get_history();

        }
        
        $scope.update_user_info();
        $scope.init();
    })

    // Авторизації користувача
    .directive('loginForm', function(){
        return {
            replace: true,
            templateUrl: '/static/tmpl/login-form.html',
            controller: function($scope, $http, $location){



                // Натискаємо кнопку авторизації
                $scope.login = function(formData){
                    var objUser = {
                        login: formData.login,
                        password: formData.password,
                    };

                    $http.post('/api/login/', objUser)
                        .then(function successCallback(response) {
                            $scope.init();
                            $scope.update_user_info();
                            $scope.update_total_budget();
                            $location.path('/#main');

                            // $scope.user_is_auth = true;
                        }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                        });                    
                }
            }
        }
    })

    .directive('logoutSection', function(){
        return {
            replace: true,
            templateUrl: '/static/tmpl/logout-section.html',
            controller: function($scope, $http){



                // Натискаємо кнопку авторизації
                $scope.logout = function(){
                    $http.post('/api/logout/')
                        .then(function successCallback(response) {
                            $scope.user_is_auth = false;
                            $("#wrapper").removeClass("toggled");


                        }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                        });                    
                }
            }
        }
    })

    .directive('registerForm', function(){
        return {
            replace: true,
            templateUrl: '/static/tmpl/register-form.html',
            controller: function($scope, $http, $location){



                // Натискаємо кнопку авторизації
                $scope.register = function(formData){

                    var objNewUser = {
                        login: formData.login,
                        password: formData.password,
                        email: formData.email,
                    }

                    $http.post('/api/register/',objNewUser)
                        .then(function successCallback(response) {
                            $scope.init();
                            $scope.update_user_info();
                            $scope.update_total_budget();
                            $location.path('/#main');

                        }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                        console.log("Error!!!" + response.data.error);
                        });                    
                }
            }
        }
    })

    /* Робота з категоріями витрат*/
    .directive('categoryFormAdd', function(){
        return {
            replace: true,
            templateUrl: '/static/tmpl/category-form-add.html',
            controller: function($scope, $http){

                $scope.display_category_form = false;


                $scope.addCategoryClick =function(){
                    $scope.hide_all_forms();
                    $scope.display_category_form = true;
                }


                /* Зберігаємо категорію в БД */
                $scope.store_category = function(formData){

                    
                    var obj = {
                        name: formData.name, // Назва категорії
                        user_id: $scope.user.id,
                    };


                    $http.post('/api/category/add/',obj)
                        .then(function successCallback(response) {
                            $scope.update_user_info();
                            $scope.display_category_form = false;
                            $scope.get_categories();
                            $scope.get_history();
                        }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                        });

                }

            }
        }
    })

    /* Робота з джерелами надходжень */
    .directive('sourceFormAdd', function(){
        return {
            replace: true,
            templateUrl: '/static/tmpl/source-form-add.html',
            controller: function($scope, $http){

                $scope.display_source_form = false;


                $scope.addSourceClick =function(){
                    $scope.hide_all_forms();
                    $scope.display_source_form = true;
                }


                /* Зберігаємо категорію в БД */
                $scope.store_source = function(formData){

                    
                    var obj = {
                        name: formData.name, // Назва категорії
                        user_id: $scope.user.id,
                    };


                    $http.post('/api/source/add/',obj)
                        .then(function successCallback(response) {
                            $scope.update_user_info();
                            $scope.display_source_form = false;   
                            $scope.get_sources();
                        }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                        });

                }


                $scope.close_source_form = function(){
                    $scope.display_source_form = false;   
                }
            }
        }
    })


    /* Робота з джерелами надходжень */
    .directive('saveFormAdd', function(){
        return {
            replace: true,
            templateUrl: '/static/tmpl/save-form-add.html',
            controller: function($scope, $http){

                $scope.display_save_form = false;


                $scope.addSaveClick =function(){
                    $scope.hide_all_forms();
                    $scope.display_save_form = true;
                }


                /* Зберігаємо категорію в БД */
                $scope.store_save = function(formData){

                    
                    var obj = {
                        name: formData.name, // Назва категорії
                        summa: formData.summa,
                        user_id: $scope.user.id,
                    };


                    $http.post('/api/save/add/',obj)
                        .then(function successCallback(response) {
                            $scope.update_user_info();
                            $scope.display_save_form = false;
                            $scope.get_saves();
                            $scope.update_total_budget();
                        }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                        });

                }

                $scope.close_save_form = function(){
                    $scope.display_save_form = false;   
                }
            }
        }
    })


    /* Робота з джерелами надходжень */
    .directive('incomeForm', function(){
        return {
            replace: true,
            templateUrl: '/static/tmpl/income-form.html',
            controller: function($scope, $http, $location){

                $scope.display_income_form = false;


                $scope.addIncomeClick =function(){
                    $scope.hide_all_forms();
                    $scope.display_income_form = true;
                }


                /* Зберігаємо категорію в БД */
                $scope.store_income = function(formData){

                    
                    var obj = {
                        notes:     formData.notes, // Коментар
                        summa:     formData.summa,
                        source_id: formData.selectedSource.id,
                        save_id:   formData.selectedSave.id,
                        user_id:   $scope.user.id,

                    };


                    $http.post('/api/income/add/',obj)
                        .then(function successCallback(response) {
                            $scope.update_user_info();
                            $scope.update_total_budget();
                            $scope.get_history();
                            $scope.display_income_form = false;
                            $location.path('/#main');
                        }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                        });

                }

                $scope.close_income_form = function(){
                    $scope.display_income_form = false;   
                }
            }
        }
    })


    /* Робота з витратами */
    .directive('outcomeForm', function(){
        return {
            replace: true,
            templateUrl: '/static/tmpl/outcome-form.html',
            controller: function($scope, $http, $location){

                $scope.display_outcome_form = false;


                $scope.addOutcomeClick =function(){
                    $scope.hide_all_forms();
                    $scope.display_outcome_form = true;
                }


                /* Зберігаємо категорію в БД */
                $scope.store_outcome = function(formData){

                    
                    var obj = {
                        notes:     formData.notes, // Коментар
                        summa:     formData.summa,
                        category_id: formData.selectedCategory.id,
                        save_id:   formData.selectedSave.id,
                        user_id:   $scope.user.id,

                    };

                    $http.post('/api/outcome/add/',obj)
                        .then(function successCallback(response) {
                            $scope.update_user_info();
                            $scope.update_total_budget();
                            $scope.get_history();
                            $scope.display_outcome_form = false;   
                            $location.path('/#main');
                        }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                        });

                }


                $scope.check_outcome_sum = function(formData){

                    var save_id = 0;
                    $scope.notEnoughSum = false;
                    try {
                        // Якщо гаманець вибраний
                        if(formData.hasOwnProperty('selectedSave')){
                            save_id = formData.selectedSave.id

                            if (save_id > 0) {
                                var param = {"save_id": save_id};
                                // Перевіряємо, чи в гаманці достатня сума коштів
                                $http.post('/api/save_sum/',param)
                                    .then(function successCallback(response) {
                                        $scope.sum_in_wallet = response.data.summa;

                                        if((formData.summa > 0) && (formData.summa > $scope.sum_in_wallet)) {
                                            $scope.notEnoughSum = true;
                                        }
                                        

                                    }, function errorCallback(response) {
                                    console.log("Error!!!" + response.err);
                                    });
                            }

                        }
                    } catch(err) {
                        // console.log(err)
                    }



                    
                }

                $scope.close_outcome_form = function(){
                    $scope.display_outcome_form = false;   
                }
            }
        }
    })

    .directive('topPanel', function(){
        return {
            replace: true,
            templateUrl: '/static/tmpl/top-panel.html',
            controller: function($scope, $http){

                


                $scope.update_total_budget = function(){

                    $http.get('/api/total_sum/')
                        .then(function successCallback(response) {
                            $scope.total_budget = response.data.total_budget;
                            $scope.month_income = response.data.month_income;
                            $scope.month_outcome = response.data.month_outcome;
                            $scope.month_balance = response.data.month_balance;

                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });                    
                }

                $scope.update_total_budget();

                



                

            }
        }
    })

    .directive('username', function($http, $q, $timeout) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                var usernames = ['Jim', 'John', 'Jill', 'Jackie'];

                ctrl.$asyncValidators.username = function(modelValue, viewValue) {
                    var username = modelValue || viewValue;

                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty model valid
                        return $q.resolve();
                    }

                    var def = $q.defer();

                    var param = {'username': username}

                    $http.post('/api/check_user/', param)
                        .then(function successCallback(response) {
                            def.reject('exists');
                        }, function errorCallback(response) {
                            def.resolve();
                        });                

                    return def.promise;
                }
            }
        }
    })


    .directive('smartFloat',function(){
        return{
            require: "ngModel",
            link: function(scope, elm, attrs, ctrl){
                
                var regex=/^\d{1,15}([\.,](\d{1,2})?)?$/;
                ctrl.$parsers.unshift(function(viewValue){
                    if( regex.test(viewValue)){
                        var floatValue = viewValue.replace(',','.');
                        floatValue = parseFloat(floatValue);
                        if(floatValue > 0) {
                            ctrl.$setValidity('validFloat',true);
                            return parseFloat(floatValue);
                        }
                        else {
                            ctrl.$setValidity('validFloat',false);
                        }
                    }
                    else{
                        ctrl.$setValidity('validFloat',false);
                    }
                    return viewValue;
                });
            }
        }
    })
