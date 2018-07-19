const ParseGooglePlacesAPIResponse = (details) => {

    let formattedAddress = details[0].formatted_address;
    let streetAddress = details[0].address_components;
    const adrAddress = details.adr_address;
    for (var i = 0; i < streetAddress.length; i++) {
                var addr = streetAddress[i];
                var countryName;
                var stateName;
                var stateShortName;
                var cityName;
                var postalCode;

                if (addr.types[0] === 'locality') {
                    cityName = addr.long_name;
                    if (cityName && formattedAddress.lastIndexOf(`, ${cityName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${cityName}`, '');
                    } else if (cityName && formattedAddress.lastIndexOf(`, ${cityName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${cityName}`, '');
                    }
                }
                if (addr.types[0] === 'administrative_area_level_1') {
                    stateName = addr.long_name;
                    stateShortName = addr.short_name
                    if (stateName && formattedAddress.lastIndexOf(`, ${stateName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${stateName}`, '');
                    } else if (stateName && formattedAddress.lastIndexOf(`, ${stateName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${stateName}`, '');
                    }
                    else if (stateShortName && formattedAddress.lastIndexOf(`, ${stateShortName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${stateShortName}`, '');
                    }
                }
                if (addr.types[0] === 'postal_code') {
                    postalCode = addr.long_name;
                    if (postalCode && formattedAddress.lastIndexOf(` ${postalCode}`) > -1) {
                        formattedAddress = formattedAddress.replace(` ${postalCode},`, '');
                    } else if (postalCode && formattedAddress.lastIndexOf(`, ${postalCode}`) > -1) {
                        formattedAddress = formattedAddress.replace(` ${postalCode},`, '');
                    }
                }
                if (addr.types[0] === 'country') {
                    countryName = addr.long_name;
                    if (countryName && formattedAddress.lastIndexOf(`, ${countryName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${countryName}`, '');
                    } else if (countryName && formattedAddress.lastIndexOf(`, ${countryName}`) > -1) {
                        formattedAddress = formattedAddress.replace(`, ${countryName}`, '');
                    }
                    //TO BE REMOVED LATER
                    else if (formattedAddress.lastIndexOf(`USA`) > -1) {
                        formattedAddress = formattedAddress.replace(`USA`, '');
                    }
                }
                localStorage.setItem('cityName', cityName);
                localStorage.setItem('postalCode', postalCode);
                localStorage.setItem('countryName', countryName);
                localStorage.setItem('stateName', stateName);
                localStorage.setItem('streetAddress', formattedAddress);
            }

    if (details[0].geometry) {
        const location = details[0].geometry.location;
        if (location) {
            localStorage.setItem('latitude', location.lat);
            localStorage.setItem('longitude', location.long);
        }
    }

};

const parseMobileNumber = (rawMobileString) => {
    return rawMobileString.toString().replace(/-/g, "").replace(/ /g, "").replace(/\(/g, "").replace(/\)/g, "");
}

export {ParseGooglePlacesAPIResponse, parseMobileNumber};
