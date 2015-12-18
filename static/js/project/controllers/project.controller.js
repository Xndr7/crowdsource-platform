(function () {
    'use strict';

    angular
        .module('crowdsource.project.controllers')
        .controller('ProjectController', ProjectController);

    ProjectController.$inject = ['$location', '$scope', '$mdToast', 'Project', '$routeParams',
        'Upload', 'helpersService', '$timeout'];

    /**
     * @namespace ProjectController
     */
    function ProjectController($location, $scope, $mdToast, Project, $routeParams, Upload, helpersService, $timeout) {
        var self = this;
        self.save = save;
        self.deleteModule = deleteModule;
        self.publish = publish;
        self.removeFile = removeFile;
        self.module = {
            "pk": null
        };
        self.upload = upload;

        activate();
        function activate() {
            self.module.pk = $routeParams.moduleId;
            Project.retrieve(self.module.pk, 'module').then(
                function success(response) {
                    self.module = response[0];
                },
                function error(response) {
                    $mdToast.showSimple('Could not get project.');
                }
            ).finally(function () {
            });
        }
        function publish(){
            if(self.module.price && self.module.repetition>0 && self.module.templates[0].template_items.length){
                Project.update(self.module.id, {'status': 2}, 'module').then(
                    function success(response) {
                        self.module.status = 2;
                        $location.path('/my-projects');
                    },
                    function error(response) {
                        $mdToast.showSimple('Could not update module status.');
                    }
                ).finally(function () {
                });
            }
            else {
                if(!self.module.price){
                    $mdToast.showSimple('Please enter task price ($/task).');
                }
                else if(!self.module.repetition){
                    $mdToast.showSimple('Please enter number of workers per task.');
                }
                if(!self.module.price){
                    $mdToast.showSimple('Please enter task price ($/task).');
                }
                else if(!self.module.templates[0].template_items.length){
                    $mdToast.showSimple('Please add at least one item to the template.');
                }
                return;
            }
        }
        var timeouts = {};
        var timeout;
        $scope.$watch('project.module', function (newValue, oldValue) {
            if (!angular.equals(newValue, oldValue) && self.module.id && oldValue.pk==undefined) {
                var request_data = {};
                var key = null;
                if(!angular.equals(newValue['name'], oldValue['name']) && newValue['name']){
                    request_data['name'] = newValue['name'];
                    key = 'name';
                }
                if(!angular.equals(newValue['price'], oldValue['price']) && newValue['price']){
                    request_data['price'] = newValue['price'];
                    key = 'price';
                }
                if(!angular.equals(newValue['repetition'], oldValue['repetition']) && oldValue['repetition']){
                    request_data['repetition'] = newValue['repetition'];
                    key = 'repetition';
                }
                if (angular.equals(request_data, {})) return;
                if(timeouts[key]) $timeout.cancel(timeouts[key]);
                timeouts[key] = $timeout(function() {
		            Project.update(self.module.id, request_data, 'module').then(
                        function success(response) {

                        },
                        function error(response) {
                            $mdToast.showSimple('Could not update module data.');
                        }
                    ).finally(function () {
                    });
                }, 2048);
            }
        }, true);

        function save(){

        }

        function addMilestone() {
            var items = self.currentProject.template.items.map(function (item, index) {
                item.position = index;
                return item;
            });
        }

        $scope.$on("$destroy", function () {
            Project.syncLocally(self.currentProject);
        });

        function upload(files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: '/api/file/',
                        //fields: {'username': $scope.username},
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        // console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        Project.attachFile(self.module.id, {"batch_file": data.id}).then(
                            function success(response) {
                                self.module.batch_files.push(data);
                            },
                            function error(response) {
                                $mdToast.showSimple('Could not upload file.');
                            }
                        ).finally(function () {
                        });

                    }).error(function (data, status, headers, config) {
                        $mdToast.showSimple('Error uploading spreadsheet.');
                    })
                }
            }
        }

        function deleteModule(){
            Project.deleteInstance(self.module.id).then(
                function success(response) {
                    $location.path('/my-projects');
                },
                function error(response) {
                    $mdToast.showSimple('Could not delete project.');
                }
            ).finally(function () {
            });
        }

        function removeFile(pk){
            Project.deleteFile(self.module.id, {"batch_file": pk}).then(
                function success(response) {
                    self.module.batch_files = []; // TODO in case we have multiple splice
                },
                function error(response) {
                    $mdToast.showSimple('Could not remove file.');
                }
            ).finally(function () {
            });
        }
    }
})();
