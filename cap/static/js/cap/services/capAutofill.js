var capAutofill = function($http, $rootScope) {

    // Needs to be specified with the following options to function
    //
    // "type": "cap:formAutofill",
    // "isAsync": "true",
    // "ref": {
    //   "url": "//maps.googleapis.com/maps/api/geocode/json",
    //   "paramKey": "address",
    //   "displayKey": ["formatted_address"],
    //   "map": [
    //     {
    //       "s": "place_id",
    //       "t": ["basic_info", "abstract"]
    //     },
    //     {
    //       "s": ["geometry", "location_type"],
    //       "t": ["#", "conclusion"]
    //     },
    //     {
    //       "s": ["geometry", "location", "lat"],
    //       "t": ["#", "software", "name"]
    //     }
    //   ]
    // }
    var autofill = function(_item, _model, _label, model, form) {
        var ref = form.ref;
        var _params = {};
        _params[ref.paramKey] = _item;

        $http.get(ref.url, {
            params: _params
        }).then(function(response){
            if( ref && ref.map){
                angular.forEach(ref.map, function(mapping){
                    var model_ref = model;
                    var resp = {};

                    if (mapping["s"]){
                        if (angular.isArray(mapping["s"])){
                            resp = response.data;
                            angular.forEach(mapping["s"], function(key){
                                if (key in resp)
                                    resp = resp[key];
                                else
                                    resp = ""
                            });
                        }
                        else{
                            // [TOFIX] for now gets only first result
                            if (response.data)
                                resp = response.data[mapping["s"]];
                        }
                    }

                    // format response if array or object
                    if (angular.isArray(resp)){

                    }
                    else if (angular.isObject(resp)){
                        resp = "";
                    }

                    if (mapping["t"]){
                        if (mapping["t"][0] === "#"){
                            _mapping = form.key.slice(0,-1);
                            _mapping = _mapping.concat((mapping["t"]).slice(1));
                        }
                        else{
                            _mapping = mapping["t"];
                        }

                        var m_length = _mapping.length;
                        angular.forEach(_mapping, function(key, index){
                                if(model_ref[key] === undefined)
                                    model_ref[key] = {};
                                if(index+1 === m_length){
                                    model_ref[key] = resp;
                                    $rootScope.$emit('fieldAutofilled', resp, {
                                        "key": _mapping
                                    });
                                }else{
                                    model_ref = model_ref[key];
                                }
                        });
                    }
                });
            };
        });
    };

    return {
        autofill: autofill,
    }
}

capAutofill.$inject = [
  '$http',
  '$rootScope'
]

angular.module('cap.services')
.service('capAutofill', capAutofill);
