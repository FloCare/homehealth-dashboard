const ParseGooglePlacesAPIResponse = (details) => {

    let streetAddress = details[0].address_components;
    for (var i = 0; i < streetAddress.length; i++) {
                var addr = streetAddress[i];
                var countryName;
                var stateName;
                var cityName;
                var postalCode;

                if (addr.types[0] === 'locality') {
                    cityName = addr.long_name;
                }
                 if (addr.types[0] === 'administrative_area_level_1') {
                    stateName = addr.long_name;
                } 
                if (addr.types[0] === 'country') {
                    countryName = addr.long_name;
                }
                if (addr.types[0] === 'postal_code') {
                    postalCode = addr.long_name;
                }
                localStorage.setItem('cityName', cityName);
                localStorage.setItem('postalCode', postalCode);
                localStorage.setItem('countryName', countryName);
                localStorage.setItem('stateName', stateName);
            }

    if (details[0].geometry) {
        const location = details[0].geometry.location;
        if (location) {
            localStorage.setItem('latitude', location.lat);
            localStorage.setItem('longitude', location.long);
        }
    }

};

export {ParseGooglePlacesAPIResponse};
