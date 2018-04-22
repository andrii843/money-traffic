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
    
        $scope.user_is_auth = false;





        // Отримуємо інформацію про користувача, якщо користувач не залогований, 
        // то переходимо на сторінку авторизації
        $scope.update_user_info = function(){
            $http.get('http://localhost:8000/api/user/')
                .then(function successCallback(response) {
                    $scope.user = response.data;

                    if($scope.user.is_auth == true) {
                        $scope.user_is_auth = true;
                    }

                }, function errorCallback(response) {
                    console.log("Error!!!" + response.err);
                    $scope.user_is_auth = true;
                });
        }
        
        $scope.update_user_info();
 
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

                    $http.post('http://localhost:8000/api/login/', objUser)
                        .then(function successCallback(response) {
                            $scope.update_user_info();
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
                    $http.post('http://localhost:8000/api/logout/')
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

                    $http.post('http://localhost:8000/api/register/',objNewUser)
                        .then(function successCallback(response) {
                            $scope.update_user_info();
                        }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                        });                    
                }
            }
        }
    })
