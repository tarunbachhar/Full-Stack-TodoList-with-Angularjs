var app = angular.module("test",[])

app.controller("nest",["$scope","$http",function(x,http){
    http.get('datat')
    .then(function(response){
        x.tasks = response.data
    },
    function(response){
        console.log(response)
    })
   
}])