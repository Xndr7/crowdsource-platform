/**
 * Project
 * @namespace crowdsource.template.services
 */
(function () {
    'use strict';

    angular
        .module('crowdsource.template.services')
        .factory('Template', Template);

    Template.$inject = ['$cookies', '$http', '$q', '$location', '$sce', 'HttpService'];

    /**
     * @namespace Template
     * @returns {Factory}
     */

    function Template($cookies, $http, $q, $location, $sce, HttpService) {
        /**
         * @name Template
         * @desc The Factory to be returned
         */
        var Template = {
            getCategories: getCategories,
            getTemplateComponents: getTemplateComponents,
            buildHtml: buildHtml
        };

        return Template;

        function getCategories() {
            return $http({
                url: '/api/category/',
                method: 'GET'
            });
        }

        function getTemplateComponents(scope) {
            var templateComponents = [
                {
                    name: "Instructions",
                    icon: 'format_size',
                    type: 'label',
                    description: "Use for static text: labels, headings, paragraphs",
                    layout: 'column',
                    data_source: null,
                    role: 'display',
                    label: 'Add instruction here',
                    values: 'dummy',
                    toHTML: function () {
                        var html = '<h1 class="md-subhead" ng-bind-html="item.label"></h1>';
                        return html;
                    },
                    toEditor: function () {
                        var html =
                            '<md-input-container>' +
                            '<label>Instruction</label>' +
                            '<textarea ng-model="item.label"></textarea>' +
                            '</md-input-container>';
                        return html;
                    }
                },
                {
                    name: "Checkbox",
                    icon: 'check_box',
                    type: 'checkbox',
                    description: "Use for selecting multiple options",
                    layout: 'column',
                    data_source: null,
                    role: 'input',
                    label: 'Add question here',
                    values: 'Option 1,Option 2,Option 3',
                    toHTML: function () {
                        scope.item.options = scope.item.values.split(',');

                        scope.toggle = function (option, selected) {
                            var answer = selected || "";
                            var options = null;

                            if (answer != "") {
                                options = answer.split(',');
                            } else {
                                options = [];
                            }

                            var index = options.indexOf(option);
                            if (index > -1) {
                                options.splice(index, 1);
                            } else {
                                options.push(option);
                            }

                            scope.item.answer = options.join(",");
                        };

                        var html = '<h1 class="md-subhead" ng-bind="item.label"></h1>' +
                            '<div layout="row" layout-wrap>' +
                            '<md-checkbox name="{{option}}" tabindex="0" ng-repeat="option in item.options track by $index" ng-click="toggle(option, item.answer)" value="{{option}}" aria-label="{{option}}">' +
                            '<span>{{option}}</span>' +
                            '</md-checkbox>' +
                            '</div>';
                        return html;
                    },
                    toEditor: function () {
                        var html = '<md-input-container>' +
                            '<label>Question</label>' +
                            '<input ng-model="item.label">' +
                            '</md-input-container>' +
                            '<md-input-container>' +
                            '<label>Options (separated by comma)</label>' +
                            '<input ng-model="item.values" ng-required>' +
                            '</md-input-container>';
                        return html;
                    }
                },
                {

                    name: "Radio Button",
                    icon: 'radio_button_checked',
                    type: 'radio',
                    description: "Use when only one option needs to be selected",
                    layout: 'column',
                    data_source: null,
                    role: 'input',
                    label: 'Add question here',
                    values: 'Option 1,Option 2,Option 3',
                    toHTML: function () {
                        scope.item.options = scope.item.values.split(',');

                        var html = '<h1 class="md-subhead" ng-bind="item.label"></h1>' +
                            '<md-radio-group tabindex="0" ng-model="item.answer" role="radiogroup" layout="row" layout-wrap>' +
                            '<md-radio-button tabindex="0" role="radio" ng-repeat="option in item.options track by $index" value="{{option}}" aria-label="{{option}}">' +
                            '{{option}}' +
                            '</md-radio-button>' +
                            '</md-radio-group>';
                        return html;
                    },
                    toEditor: function () {
                        var html = '<md-input-container>' +
                            '<label>Question</label>' +
                            '<input ng-model="item.label">' +
                            '</md-input-container>' +
                            '<md-input-container>' +
                            '<label>Options (separated by comma)</label>' +
                            '<input ng-model="item.values" ng-required>' +
                            '</md-input-container>';
                        return html;
                    }
                },
                {
                    name: "Select List",
                    icon: 'list',
                    type: 'select',
                    description: "Use for selecting multiple options from a larger set",
                    layout: 'column',
                    data_source: null,
                    role: 'input',
                    label: 'Add question here',
                    values: 'Option 1,Option 2,Option 3',
                    toHTML: function () {
                        scope.item.options = scope.item.values.split(',');

                        var html = '<h1 class="md-subhead" ng-bind="item.label"></h1>' +
                            '<div layout="row" layout-wrap flex>' +
                            '<md-select ng-model="item.answer" aria-label="{{item.label}}" flex>' +
                            '<md-option tabindex="0" ng-repeat="option in item.options track by $index" value="{{option}}" aria-label="{{option}}">{{option}}</md-option>' +
                            '</md-select>' +
                            '</div>';
                        return html;
                    },
                    toEditor: function () {
                        var html = '<md-input-container>' +
                            '<label>Question</label>' +
                            '<input ng-model="item.label">' +
                            '</md-input-container>' +
                            '<md-input-container>' +
                            '<label>Options (separated by comma)</label>' +
                            '<input ng-model="item.values" ng-required>' +
                            '</md-input-container>';
                        return html;
                    }
                },
                {
                    name: "Text Input",
                    icon: 'text_format',
                    type: 'text_field',
                    description: "Use for short text input",
                    layout: 'column',
                    data_source: null,
                    role: 'input',
                    label: 'Add question here',
                    values: 'Enter text here',
                    toHTML: function () {
                        var html = '<md-input-container md-no-float>' +
                            '<h1 class="md-subhead" ng-bind="item.label"></h1>' +
                            '<input type="text" tabindex="0" ng-model="item.answer" ng-required="true" aria-label="{{item.label}}" placeholder="{{item.values}}">' +
                            '</md-input-container>';
                        return html;
                    },
                    toEditor: function () {
                        var html = '<md-input-container>' +
                            '<label>Question</label>' +
                            '<input ng-model="item.label" ng-required aria-label="{{item.label}}">' +
                            '</md-input-container>' +
                            '<md-input-container>' +
                            '<label>Placeholder</label>' +
                            '<input ng-model="item.values">' +
                            '</md-input-container>';
                        return html;
                    }
                },
                {

                    name: "Text Area",
                    icon: 'subject',
                    type: 'text_area',
                    description: "Use for longer text input",
                    layout: 'column',
                    data_source: null,
                    role: 'input',
                    label: 'Add question here',
                    values: 'Enter text here',
                    toHTML: function () {
                        var html = '<md-input-container>' +
                            '<h1 class="md-subhead" ng-bind="item.label"></h1>' +
                            '<textarea ng-model="item.answer" tabindex="0" ng-required="true" aria-label="{{item.label}}"></textarea>' +
                            '</md-input-container>';
                        return html;
                    },
                    toEditor: function () {
                        var html = '<md-input-container>' +
                            '<label>Question</label>' +
                            '<input ng-model="item.label" ng-required>' +
                            '</md-input-container>' +
                            '<md-input-container>' +
                            '<label>Placeholder</label>' +
                            '<input ng-model="item.values">' +
                            '</md-input-container>';
                        return html;
                    }
                },
                {
                    name: "Image",
                    icon: 'photo',
                    type: 'image',
                    description: "A placeholder for the image",
                    layout: 'column',
                    data_source: null,
                    role: 'display',
                    label: 'Heading',
                    values: 'http://placehold.it/300x300?text=Image',
                    toHTML: function () {
                        var html = '<h1 class="md-subhead" ng-bind="item.label"></h1>' +
                            '<img class="image-container" ng-src="{{item.values}}">';
                        return html;
                    },
                    toEditor: function () {
                        var html = '<md-input-container>' +
                            '<label>Heading</label>' +
                            '<input ng-model="item.label">' +
                            '</md-input-container>' +
                            '<md-input-container>' +
                            '<label>Image URL</label>' +
                            '<input ng-model="item.values" ng-required>' +
                            '</md-input-container>';
                        return html;
                    }
                },
                {
                    name: "Audio",
                    icon: 'music_note',
                    type: 'audio',
                    description: "A placeholder for the audio player",
                    layout: 'column',
                    data_source: null,
                    role: 'display',
                    label: 'Heading',
                    values: 'http://www.noiseaddicts.com/samples_1w72b820/3724.mp3',
                    toHTML: function () {
                        scope.item.options = $sce.trustAsResourceUrl(scope.item.values);
                        var html = '<h1 class="md-subhead" ng-bind="item.label"></h1>' +
                            '<audio class="audio-container" ng-src="{{item.options}}" audioplayer controls style="margin-bottom:8px;"> <p>Your browser does not support the <code>audio</code> element.</p> </audio>';
                        return html;
                    },
                    toEditor: function () {
                        var html = '<md-input-container>' +
                            '<label>Heading</label>' +
                            '<input ng-model="item.label">' +
                            '</md-input-container>' +
                            '<md-input-container>' +
                            '<label>Audio URL</label>' +
                            '<input ng-model="item.values" ng-required>' +
                            '</md-input-container>';
                        return html;
                    }
                }
                // {
                //   id: 8,
                //   name: "Video Container",
                //   icon: null,
                //   type: 'video',
                //   description: "A placeholder for the video player"
                // },
            ];

            return templateComponents;
        }

        function buildHtml(item) {
            var html = '';
            if (item.type === 'label') {
                html = '<' + item.sub_type + ' style="word-wrap:break-word">' + item.values + '</' + item.sub_type + '>';
            }
            else if (item.type === 'image') {
                html = '<img class="image-container" src="' + item.values + '">' + '</img>';
            }
            else if (item.type === 'radio') {
                html = '<md-radio-group class="template-item" ng-model="item.answer" layout="' + item.layout + '">' +
                    '<md-radio-button tabindex="' + item.tabIndex + '" ng-repeat="option in item.values.split(\',\')" value="{{option}}">{{option}}</md-radio-button>';
            }
            else if (item.type === 'checkbox') {
                html = '<div  layout="' + item.layout + '" layout-wrap><div class="template-item" ng-repeat="option in item.values.split(\',\')" >' +
                    '<md-checkbox tabindex="' + item.tabIndex + '"> {{ option }}</md-checkbox></div></div> ';
            } else if (item.type === 'text_area') {
                html = '<md-input-container><label>' + item.values + '</label><textarea class="template-item" ng-model="item.answer" layout="' +
                    item.layout + '"' + ' tabindex="' + item.tabIndex + '"></textarea></md-input-container>';
            } else if (item.type === 'text_field') {
                html = '<md-input-container><label>' + item.values + '</label><input type="text" class="template-item" ng-model="item.answer" layout="' +
                    item.layout + '"' + ' tabindex="' + item.tabIndex + '"/></md-input-container>';
            } else if (item.type === 'select') {
                html = '<md-select class="template-item" ng-model="item.answer" layout="' + item.layout + '">' +
                    '<md-option tabindex="' + item.tabIndex + '" ng-repeat="option in item.values.split(\',\')" value="{{option}}">{{option}}</md-option></md-select>';
            } else if (item.type === 'labeled_input') {
                html = '<div layout="row" style="word-wrap:break-word"><' + item.sub_type + ' flex="75" layout="column">' + item.values + '</' +
                    item.sub_type + '><md-input-container flex="25" layout="column">' +
                    '<label>Enter text here</label>' +
                    '<input tabindex="' + item.tabIndex + '" type="text" class="ranking-item" ng-model="item.answer">' +
                    '</md-input-container></div>';
            }
            else if (item.type === 'audio') {
                html = '<audio src="' + item.values + '" controls> <p>Your browser does not support the <code>audio</code> element.</p> </audio>';
            }
            return html;
        }
    }
})();