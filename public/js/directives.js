/* global angular, hljs */
angular.module('main')
// Add syntax highlight to code blocks that have a pre without the nohighlight attribute
.directive('code', function() {
    return {
        restrict: 'E',
        link: function (scope, elem, attr) {
            var pre = elem.parent('pre');

            if (pre.length === 0 || pre.attr('nohighlight') === 'true') {
                return;
            }
            if (attr.hasOwnProperty('ngBind')) {
                scope.$watch(attr.ngBind, function(){
                    hljs.highlightBlock(elem[0]);
                });
            }

            hljs.highlightBlock(elem[0]);
        }
    };
});
