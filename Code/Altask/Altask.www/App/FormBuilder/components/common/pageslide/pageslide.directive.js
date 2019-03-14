const PAGE_SLIDE_DIRECTIVE = 'pageslide';

function pageslide() {
    let directive = {
        restrict: 'EAC',
        transclude: false,
        scope: {
            psOpen: '=?',
            psAutoClose: '=?',
            psSide: '@',
            psSpeed: '@',
            psClass: '@',
            psSize: '@',
            psSqueeze: '@',
            psCloak: '@',
            psPush: '@',
            psContainer: '@'
        },
        link: linkFct
    };
    return directive;

    function linkFct(scope, el, attrs) {
        el.addClass('resizable');

        var style = window.getComputedStyle(el[0], null),
            dragWidth,
            dragStartX;


        var dragging = function(e) {
            let minWidth = el[0].style.minWidth;
            let width = dragWidth - (dragStartX - e.clientX) + 'px';

            if (minWidth && width >= minWidth) {
                el[0].style.width = dragWidth - (dragStartX - e.clientX) + 'px';
            }
        }

        var dragEnd = function(e) {
            document.removeEventListener('mouseup', dragEnd, false);
            document.removeEventListener('mousemove', dragging, false);
            el.removeClass('no-transition');
            el[0].style.minWidth = "";
        }

        var dragStart = function(e) {
            dragStartX = e.clientX;
            dragWidth = parseInt(style.getPropertyValue("width"));

            //prevent transition while dragging
            el.addClass('no-transition');
            el[0].style.minWidth = param.size;
            document.addEventListener('mouseup', dragEnd, false);
            document.addEventListener('mousemove', dragging, false);

            // Disable highlighting while dragging
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();
            e.cancelBubble = true;
            e.returnValue = false;
        };

            var grabber = document.createElement('div'),
                direction = "right";

            // add class for styling purposes
            grabber.setAttribute('class', 'rg-right');
            grabber.innerHTML = '<span><i class="fa fa-bars fa-rotate-90" aria-hidden="true"></i></span>';
            el[0].appendChild(grabber);
            grabber.ondragstart = function() {
                return false
            }
            grabber.addEventListener('mousedown', function(e) {
                dragStart(e);
            }, false);

        /* Parameters */
        var param = {};

        param.side = scope.psSide || 'right';
        param.speed = scope.psSpeed || '0.5';
        param.size = scope.psSize || '300px';
        param.zindex = 1000; // Override with custom CSS
        param.className = scope.psClass || 'ng-pageslide';
        param.cloak = scope.psCloak && scope.psCloak.toLowerCase() == 'false' ? false : true;
        param.squeeze = Boolean(scope.psSqueeze) || false;
        param.push = Boolean(scope.psPush) || false;
        param.container = scope.psContainer || false;

        // Apply Class
        el.addClass(param.className);

        /* DOM manipulation */
        let content = null;
        let slider = null;
        let body = param.container ? document.getElementById(param.container) : document.body;

        slider = el[0];

        // Check for div tag
        if (slider.tagName.toLowerCase() !== 'div' &&
            slider.tagName.toLowerCase() !== 'pageslide')
            throw new Error('Pageslide can only be applied to <div> or <pageslide> els');

        // Check for content
        if (slider.children.length === 0)
            throw new Error('You have to content inside the <pageslide>');

        content = angular.element(slider.children);

        /* Append */
        body.appendChild(slider);

        /* Style setup */
        slider.style.zIndex = param.zindex;
        slider.style.position = param.container !== false ? 'absolute' : 'fixed';
        slider.style.width = 0;
        slider.style.height = 0;
        slider.style.overflow = 'hidden';
        slider.style.transitionDuration = param.speed + 's';
        slider.style.webkitTransitionDuration = param.speed + 's';
        slider.style.transitionProperty = 'width, height';
        if (param.squeeze) {
            body.style.position = 'absolute';
            body.style.transitionDuration = param.speed + 's';
            body.style.webkitTransitionDuration = param.speed + 's';
            body.style.transitionProperty = 'top, bottom, left, right';
        }

        switch (param.side) {
            case 'right':
                slider.style.height = attrs.psCustomHeight || '100%';
                slider.style.top = attrs.psCustomTop || '0px';
                slider.style.bottom = attrs.psCustomBottom || '0px';
                slider.style.right = attrs.psCustomRight || '0px';
                break;
            case 'left':
                slider.style.height = attrs.psCustomHeight || '100%';
                slider.style.top = attrs.psCustomTop || '0px';
                slider.style.bottom = attrs.psCustomBottom || '0px';
                slider.style.left = attrs.psCustomLeft || '0px';
                break;
            case 'top':
                slider.style.width = attrs.psCustomWidth || '100%';
                slider.style.left = attrs.psCustomLeft || '0px';
                slider.style.top = attrs.psCustomTop || '0px';
                slider.style.right = attrs.psCustomRight || '0px';
                break;
            case 'bottom':
                slider.style.width = attrs.psCustomWidth || '100%';
                slider.style.bottom = attrs.psCustomBottom || '0px';
                slider.style.left = attrs.psCustomLeft || '0px';
                slider.style.right = attrs.psCustomRight || '0px';
                break;
        }


        /* Closed */
        function psClose(slider, param) {
            if (slider && slider.style.width !== 0 && slider.style.width !== 0) {
                if (param.cloak) content.css('display', 'none');
                switch (param.side) {
                    case 'right':
                        slider.style.width = '0px';
                        if (param.squeeze) body.style.right = '0px';
                        if (param.push) {
                            body.style.right = '0px';
                            body.style.left = '0px';
                        }
                        break;
                    case 'left':
                        slider.style.width = '0px';
                        if (param.squeeze) body.style.left = '0px';
                        if (param.push) {
                            body.style.left = '0px';
                            body.style.right = '0px';
                        }
                        break;
                    case 'top':
                        slider.style.height = '0px';
                        if (param.squeeze) body.style.top = '0px';
                        if (param.push) {
                            body.style.top = '0px';
                            body.style.bottom = '0px';
                        }
                        break;
                    case 'bottom':
                        slider.style.height = '0px';
                        if (param.squeeze) body.style.bottom = '0px';
                        if (param.push) {
                            body.style.bottom = '0px';
                            body.style.top = '0px';
                        }
                        break;
                }
            }
            scope.psOpen = false;
        }

        /* Open */
        function psOpen(slider, param) {
            if (slider.style.width !== 0 && slider.style.width !== 0) {
                switch (param.side) {
                    case 'right':
                        slider.style.width = param.size;
                        if (param.squeeze) body.style.right = param.size;
                        if (param.push) {
                            body.style.right = param.size;
                            body.style.left = '-' + param.size;
                        }
                        break;
                    case 'left':
                        slider.style.width = param.size;
                        if (param.squeeze) body.style.left = param.size;
                        if (param.push) {
                            body.style.left = param.size;
                            body.style.right = '-' + param.size;
                        }
                        break;
                    case 'top':
                        slider.style.height = param.size;
                        if (param.squeeze) body.style.top = param.size;
                        if (param.push) {
                            body.style.top = param.size;
                            body.style.bottom = '-' + param.size;
                        }
                        break;
                    case 'bottom':
                        slider.style.height = param.size;
                        if (param.squeeze) body.style.bottom = param.size;
                        if (param.push) {
                            body.style.bottom = param.size;
                            body.style.top = '-' + param.size;
                        }
                        break;
                }
                setTimeout(() => {
                    if (param.cloak) content.css('display', 'block');
                }, (param.speed * 1000));

            }
        }

        // function isFunction(functionToCheck) {
        // var getType = {};
        // return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        // }

        /*
         * Watchers
         * */

        scope.$watch('psOpen', (value) => {
            /* eslint no-extra-boolean-cast:0 */
            if (!!value) {
                // Open
                psOpen(slider, param);
            } else {
                // Close
                psClose(slider, param);
            }
        });


        /*
         * Events
         * */

        scope.$on('$destroy', () => body.removeChild(slider));

        if (scope.psAutoClose) {
            scope.$on('$locationChangeStart', () => psClose(slider, param));
            scope.$on('$stateChangeStart', () => psClose(slider, param));
        }
    }

}

pageslide.$inject = [];

export default pageslide;

export {
    PAGE_SLIDE_DIRECTIVE
};