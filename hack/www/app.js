/**
 * Created by aetdeveloper on 29/11/14.
 */
var cacheTheCastle = angular.module('hs.mapbox', ['ionic','ionic.service.platform', 'ionic.ui.content', 'ionic.ui.list', 'ionic.service.loading']);

var HSSearch = {
    lastParams: false,
    placeSearch: false,
    autocomplete: false,
    callback: false,

    componentForm: {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    },

    labelConversion: {
        "street_number": 'street_number',
        "route": 'route',
        "locality": 'city',
        "administrative_area_level_1": 'state',
        "country": 'country',
        "postal_code": 'zip'
    },

    init: function () {
        this.placeInit();
        $(document).on("gotPosition", HSSearch.biasResults);
    },

    biasResults: function() {
        var geolocation = new google.maps.LatLng(
            window.userPosition.coords.latitude, window.userPosition.coords.longitude);
        HSSearch.autocomplete.setBounds(new google.maps.LatLngBounds(geolocation,
            geolocation));
    },

    placeInit: function() {
        // Create the autocomplete object, restricting the search
        // to geographical location types.
        HSSearch.autocomplete = new google.maps.places.Autocomplete(
            /** @type {HTMLInputElement} */(document.getElementById('searchInput')),
            { types: ['geocode'] });
        // When the user selects an address from the dropdown,
        // do search
        google.maps.event.addListener(HSSearch.autocomplete, 'place_changed', function() {
            HSSearch.fillInAddress();
        });
    },

    fillInAddress: function() {
        // Get the place details from the autocomplete object.
        var place = HSSearch.autocomplete.getPlace();

        // Get place lat/lon
        var params = {};
        params["lat"] = place.geometry.location.d;
        params["lon"] = place.geometry.location.e;
        params["full"] = $("#stormSearchInput").val();

        // Get each component of the address from the place details
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (HSSearch.labelConversion[addressType]) {
                var lbl = HSSearch.labelConversion[addressType];
                params[lbl] = place.address_components[i][HSSearch.componentForm[addressType]];
                if(addressType == "country" && params[lbl] != "United States") {
                    $("#stormSearchInput").val("");
                    alert("Only US Locations are supported at this time.");
                    return;
                }
            }
        }

        console.log(params);
    }
};