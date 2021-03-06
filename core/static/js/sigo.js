var sigo = function(){

    function sigo(input, endpoint, destination, form, template){

        var self = this;

        self.input = input;
        self.endpoint = endpoint;
        self.destination = destination;
        self.form = form;
        self.template = template;

        self.utils = {

            getElementPosition: function (field){
                var offsetLeft = 0;
                var offsetTop = 0;
                while (field) {
                    offsetLeft += field.offsetLeft;
                    offsetTop += field.offsetTop;
                    field = field.offsetParent;
                }

                return {
                    left: offsetLeft,
                    top: offsetTop
                };
            }

        };

        self.getElementById = function(elem){

            if(typeof elem == 'object'){
                return elem;
            } else {
                return document.getElementById(elem);
            }

        };

        self.bind = function(){

            self.getElementById(self.input).addEventListener('keyup', self.handleInputKeyup);
            document.addEventListener('click', self.handleAutocompleteItemClick);

            // being nice.
            self.getElementById(self.input).setAttribute('autocomplete', 'off');

        };


        self.unbind = function(){
            //
        };

        self.handleAutocompleteItemClick = function(e){

            var autocomplete = e.target.closest('.autocomplete-list');
            if(!autocomplete || autocomplete.getAttribute('id') != 'autocomplete-' + self.input){
                return true;
            }

            var li = e.target.closest('li');
            if(!li){
                return true;
            }

            self.getElementById(self.destination).value = li.getAttribute('data-id');
            self.hideAndDisableForm();
            self.getElementById(self.input).value = li.innerText;

            self.hideAutocompleteWidget();

        };

        self.handleInputKeyup = function(e){

            clearTimeout(self.handleLookupTimeout);

            self.handleLookupTimeout = setTimeout(function(){

                if(!self.getElementById(self.input).value){
                    self.hideAutocompleteWidget();
                    return;
                }

                self.lookup = new XMLHttpRequest();
                self.lookup.open('GET', self.endpoint + '?search=' + encodeURIComponent(self.getElementById(self.input).value));
                self.lookup.setRequestHeader('Accept', 'application/json');
                self.lookup.send(null);
                self.lookup.onreadystatechange = function(){
                    var DONE = 4, OK = 200;
                    if(self.lookup.readyState == DONE && self.lookup.status == OK){
                        var response = JSON.parse(self.lookup.responseText);
                        if(response.length){
                            self.initWidget(response);
                        } else {
                            self.hideAutocompleteWidget();
                            self.showAndEnableForm();
                            self.getElementById(self.destination).value = '';
                        }
                    }
                }

                
            }, 400);

        };

        self.showAndEnableForm = function(){
            var form = self.getElementById(self.form);
            form.classList.remove('hidden');
            var elements = form.querySelectorAll('input, select');
            for(var i = 0; i < elements.length; i++){
                elements[i].removeAttribute('disabled');
            }
        };

        self.hideAndDisableForm = function(){
            var form = self.getElementById(self.form);
            form.classList.add('hidden');
            var elements = form.querySelectorAll('input, select');
            for(var i = 0; i < elements.length; i++){
                elements[i].setAttribute('disabled', 'disabled');
            }
        };

        self.hideAutocompleteWidget = function(){

            var autocomplete = document.getElementById('autocomplete-' + self.input);
            if(autocomplete){
                autocomplete.parentNode.removeChild(autocomplete);
            }

        };

        self.initWidget = function(response){

            self.hideAutocompleteWidget();

            var list = document.createElement('ul');
            list.setAttribute('id', 'autocomplete-' + self.input);
            list.classList.add('autocomplete-list');
            list.classList.add('list-group');
            for(var i = 0; i < response.length; i++){
                var li = document.createElement('li');
                li.classList.add('list-group-item');
                var item = response[i];
                // super secure.
                li.innerHTML = eval("`" + self.template + "`");
                li.setAttribute('data-id', response[i].id);
                list.appendChild(li);
            }

            var fieldPosition = self.utils.getElementPosition(self.getElementById(self.input));
            list.style.position = 'absolute';
            list.style.left = fieldPosition.left + 'px';
            list.style.top = fieldPosition.top + self.getElementById(self.input).offsetHeight + 5 + 'px';

            document.getElementsByTagName('body')[0].appendChild(list);
        };

        self.bind();
        self.hideAndDisableForm();
        
        return self;

    };

    return sigo;

}();