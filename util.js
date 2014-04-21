$(function(){
    $('.delete').click(function(event){
        event.preventDefault();
        var result = confirm("Are you sure you want to delete this Tour?");
        var btn = $(this);
        if ( result == true ){
            $.post( btn.attr('href'), function( data ) {
                alert(data);
                window.location = '/tours';
            });
        }
    });
});

//Marker Object
function TouryMarker() {
}
TouryMarker.prototype.marker = '';
TouryMarker.prototype.infowindow = '';

//Javascript Dictionary Object
function JSdict() {
    this.Keys = [];
    this.Values = [];
}

// Check if dictionary extensions aren't implemented yet.
// Returns value of a key
if (!JSdict.prototype.getVal) {
    JSdict.prototype.getVal = function (key) {
        if (key == null) {
            return "Key cannot be null";
        }
        for (var i = 0; i < this.Keys.length; i++) {
            if (this.Keys[i] == key) {
                return this.Values[i];
            }
        }
        return "Key not found!";
    }
}

// Check if dictionary extensions aren't implemented yet.
// Returns array of keys
if (!JSdict.prototype.keys) {
    JSdict.prototype.keys = function () {
        var result = [];
        for (var i = 0; i < this.Keys.length; i++) {
            result.push(this.Keys[i]);
        }
        return result;
    }
}


// Check if dictionary extensions aren't implemented yet.
// Updates value of a key
if (!JSdict.prototype.update) {
    JSdict.prototype.update = function (key, val) {
        if (key == null || val == null) {
            return "Key or Value cannot be null";
        }
        // Verify dict integrity before each operation
        if (keysLength != valsLength) {
            return "Dictionary inconsistent. Keys length don't match values!";
        }
        var keysLength = this.Keys.length;
        var valsLength = this.Values.length;
        var flag = false;
        for (var i = 0; i < keysLength; i++) {
            if (this.Keys[i] == key) {
                this.Values[i] = val;
                flag = true;
                break;
            }
        }
        if (!flag) {
            return "Key does not exist";
        }
    }
}



// Check if dictionary extensions aren't implemented yet.
// Adds a unique key value pair
if (!JSdict.prototype.put) {
    JSdict.prototype.put = function (key, val) {
        // Allow only strings or numbers as keys
        if (typeof (key) == "number" || typeof (key) == "string") {
            if (key == null || val == null) {
                return "Key or Value cannot be null";
            }
            if (keysLength != valsLength) {
                return "Dictionary inconsistent. Keys length don't match values!";
            }
            var keysLength = this.Keys.length;
            var valsLength = this.Values.length;
            for (var i = 0; i < keysLength; i++) {
                if (this.Keys[i] == key) {
                    return "Duplicate keys not allowed!";
                }
            }
            this.Keys.push(key);
            this.Values.push(val);
        }
        else {
            return "Only number or string can be key!";
        }
    }
}

// Check if dictionary extensions aren't implemented yet.
// Removes a key value pair
if (!JSdict.prototype.remove) {
    JSdict.prototype.remove = function (key) {
        if (key == null) {
            return "Key cannot be null";
        }
        if (keysLength != valsLength) {
            return "Dictionary inconsistent. Keys length don't match values!";
        }
        var keysLength = this.Keys.length;
        var valsLength = this.Values.length;
        var flag = false;
        for (var i = 0; i < keysLength; i++) {
            if (this.Keys[i] == key) {
                this.Keys.shift(key);
                this.Values.shift(this.Values[i]);
                flag = true;
                break;
            }
        }
        if (!flag) {
            return "Key does not exist";
        }
    }
}