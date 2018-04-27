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
                    console.log(response.data);
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


        $scope.init = function() {
            $scope.update_user_info();
            $scope.get_sources();
            $scope.get_saves();
            $scope.get_categories();             
        }

        $scope.update_user_info();
        $scope.init();
    })

    // Авторизації користувача
    .directive('loginForm', function(){
        return {
            replace: true,
            templateUrl: '/static/tmpl/login-form.html',
            controller: function($scope, $http){



                // Натискаємо кнопку авторизації
                $scope.login = function(formData){
                    var objUser = {
                        login: formData.login,
                        password: formData.password,
                    };

                    $http.post('/api/login/', objUser)
                        .then(function successCallback(response) {
                            $scope.update_user_info();
                            $scope.init();
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
            controller: function($scope, $http){



                // Натискаємо кнопку авторизації
                $scope.register = function(formData){

                    var objNewUser = {
                        login: formData.login,
                        password: formData.password,
                        email: formData.email,
                    }

                    $http.post('/api/register/',objNewUser)
                        .then(function successCallback(response) {
                            $scope.update_user_info();
                        }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
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
                        }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                        });

                }


                $scope.close_category_form = function(){
                    $scope.display_category_form = false;   
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
            controller: function($scope, $http){

                $scope.display_income_form = false;


                $scope.addIncomeClick =function(){
                    $scope.hide_all_forms();
                    $scope.display_income_form = true;
                }


                /* Зберігаємо категорію в БД */
                $scope.store_save = function(formData){

                    
                    var obj = {
                        name: formData.name, // Назва категорії
                        summa: formData.summa,
                        user_id: $scope.user.id,
                    };


                    // $http.post('http://localhost:8000/api/income/add/',obj)
                    //     .then(function successCallback(response) {
                    //         $scope.update_user_info();
                    //         $scope.display_save_form = false;                            
                    //     }, function errorCallback(response) {
                    //     console.log("Error!!!" + response.err);
                    //     });

                }

                $scope.close_income_form = function(){
                    $scope.display_income_form = false;   
                }
            }
        }
    })
