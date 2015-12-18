/**
 * Project
 * @namespace crowdsource.project.services
 * @author dmorina neilthemathguy
 */
(function () {
    'use strict';

    angular
        .module('crowdsource.project.services')
        .factory('Project', Project);

    Project.$inject = ['$cookies', '$http', '$q', '$location', 'HttpService', 'LocalStorage'];

    /**
     * @namespace Project
     * @returns {Factory}
     */

    function Project($cookies, $http, $q, $location, HttpService, LocalStorage) {
        /**
         * @name Project
         * @desc The Factory to be returned
         */

        var Project = {
            syncLocally: syncLocally,
            retrieve: retrieve,
            addProject: addProject,
            addMilestone: addMilestone,
            getCategories: getCategories,
            getProjects: getProjects,
            getLastMilestone: getLastMilestone,
            clean: clean,
            getRequesterProjects: getRequesterProjects,
            getModules: getModules,
            getModuleComments: getModuleComments,
            create: create,
            update: update,
            deleteInstance: deleteInstance,
            attachFile: attachFile,
            deleteFile: deleteFile,
            getRequesterModules: getRequesterModules,
            fork: fork,
            currentModule: {}
        };

        return Project;
        /**
         * @name create
         * @desc Create a new Project
         * @returns {Promise}
         * @memberOf crowdsource.project.services.Project
         */
        function create(data){
            var settings = {
                url: '/api/project/',
                method: 'POST',
                data: data
            };
            return HttpService.doRequest(settings);
        }

        /**
         * @name update
         * @desc Update an existing project
         * @returns {Promise}
         * @memberOf crowdsource.project.services.Project
         */
        function update(pk, data, path) {
            var settings = {
                url: '/api/'+path+'/'+pk+'/',
                method: 'PUT',
                data: data
            };
            return HttpService.doRequest(settings);
        }
        function retrieve(pk, path) {
            var settings = {
                url: '/api/'+path+'/'+pk+'/',
                method: 'GET'
            };
            return HttpService.doRequest(settings);
        }

        function deleteInstance(pk) {
            var settings = {
                url: '/api/module/'+pk+'/',
                method: 'DELETE'
            };
            return HttpService.doRequest(settings);
        }

        /**
         * @name addProject
         * @desc Try to create a new project
         * @returns {Promise}
         * @memberOf crowdsource.project.services.Project
         */

        function addProject(project) {
            var settings = {
                url: '/api/project/',
                method: 'POST',
                data: {
                    name: project.name,
                    description: project.description,
                    categories: project.categories,
                    modules: [
                        {
                            name: 'Prototype Task',
                            description: project.taskDescription,
                            template: [
                                {
                                    name: project.template.name,
                                    template_items: project.template.items
                                }
                            ],
                            price: project.payment.wage_per_hit,
                            repetition: project.payment.number_of_hits || 1,
                            number_of_hits: project.payment.number_of_hits,
                            has_data_set: project.metadata ? true : false,
                            is_micro: project.microFlag === 'micro',
                            is_prototype: true,
                            file_id: project.metadata ? project.metadata.id : null,
                            task_time: project.taskTime
                        }
                    ]
                }
            };
            return HttpService.doRequest(settings);
        }

        function addMilestone(project, projectId) {
            var settings = {
                url: '/api/module/',
                method: 'POST',
                data: {
                    name: project.moduleName,
                    description: project.taskDescription,
                    project: projectId,
                    template: [
                        {
                            name: project.template.name,
                            template_items: project.template.items
                        }
                    ],
                    price: project.payment.wage_per_hit,
                    repetition: project.payment.number_of_hits || 1,
                    number_of_hits: project.payment.number_of_hits,
                    has_data_set: project.metadata ? true : false,
                    is_micro: project.microFlag === 'micro',
                    file_id: project.metadata ? project.metadata.id : null,
                    task_time: project.taskTime
                }
            };
            return HttpService.doRequest(settings);
        }

        function getProjects() {
            var settings = {
                url: '/api/project/',
                method: 'GET'
            };
            return HttpService.doRequest(settings);
        }

        function getRequesterProjects() {
            var settings = {
                url: '/api/project/requester_projects/',
                method: 'GET'
            };
            return HttpService.doRequest(settings);
        }

        function getCategories() {
            var settings = {
                url: '/api/category/',
                method: 'GET'
            };
            return HttpService.doRequest(settings);
        }

        function getLastMilestone(projectId) {
            var settings = {
                url: '/api/module/get_last_milestone/',
                method: 'GET',
                params: {
                    projectId: projectId
                }
            };
            return HttpService.doRequest(settings);
        }

        function syncLocally(projectInstance) {
            LocalStorage.set('project', projectInstance);
        }

        function retrieve_old() {
            var instance = LocalStorage.get('project', {
                totalTasks: 1
            });
            return instance;
        }

        function clean() {
            LocalStorage.set('project', {
                totalTasks: 1
            });
        }

        function getModules(project_id) {
            var settings = {
                url: '/api/module/list_by_project/',
                method: 'GET',
                params: {
                    project_id: project_id
                }
            };
            return HttpService.doRequest(settings);
        }

        function getModuleComments(module_id) {
            var settings = {
                url: '/api/module/' + module_id + '/list_comments/',
                method: 'GET'
            };
            return HttpService.doRequest(settings);
        }

        function attachFile(pk, data){
            var settings = {
                url: '/api/module/'+pk+'/attach_file/',
                method: 'POST',
                data: data
            };
            return HttpService.doRequest(settings);
        }

        function deleteFile(pk, data){
            var settings = {
                url: '/api/module/'+pk+'/delete_file/',
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            return HttpService.doRequest(settings);
        }

        function getRequesterModules() {
            var settings = {
                url: '/api/module/requester_modules/',
                method: 'GET'
            };
            return HttpService.doRequest(settings);
        }

        function fork(pk) {
            var settings = {
                url: '/api/module/'+pk +'/fork/',
                method: 'POST'
            };
            return HttpService.doRequest(settings);
        }

    }
})();
