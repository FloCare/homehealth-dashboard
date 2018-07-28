// in src/dataProvider
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    fetchUtils,
} from 'react-admin';
import {stringify} from 'query-string';
import {parseMobileNumber, capitalize} from './parsingUtils';

const API_URL = 'https://app-9707.on-aptible.com';
//const API_URL = 'https://app-9781.on-aptible.com';
//const API_URL = 'http://localhost:8000';

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
const convertDataProviderRequestToHTTP = (type, resource, params) => {
    console.log('Converting Data Provider Call to HTTP Request on:');
    console.log('This called:', type, resource, params);

    switch (type) {
        case GET_LIST: {
            // console.log('Running GET LIST for:', resource);
            const {page, perPage} = params.pagination;
            const {field, order} = params.sort;
            const {q} = params.filter;
            // console.log(page);
            const query = {
                format: 'json',
                query: q,
                size: perPage
                // range: JSON.stringify([(page - 1) * perPage, page * perPage - 1])
            };
            // console.log(query.range);
            const options = {};
            options.headers = new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')});
            switch(resource) {
                case 'users':
                    return { url: `${API_URL}/${resource}/v1.0/org-access/?${stringify(query)}`, options};
                case 'phi':
                    return { url: `${API_URL}/${resource}/v1.0/patients/?${stringify(query)}`, options};
                case 'physicians':
                    return { url: `${API_URL}/phi/v1.0/physicians/?${stringify(query)}`, options};
                default:
                    throw new Error(`Unsupported fetch action type ${type}`);
            }
        }

        case GET_ONE:
            const options = {};
            options.headers = new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')});
            switch(resource) {
                case 'phi':
                    return { url: `${API_URL}/${resource}/v1.0/patients/${params.id}/`, options };
                case 'physicians':
                    return { url: `${API_URL}/phi/v1.0/physicians/${params.id}/`, options };
                default:
                    throw new Error(`Unsupported fetch action type ${type}`);
            }

        case GET_MANY: {
            // console.log('Running GET MANY for:', resource);
            // const users = params.ids;
            // const ids = [];
            // for(let i in users){
            //     ids.push(users[i].id);
            // }
            // console.log('ids:',ids);
            const query = {
                format: 'json',
                // sort: JSON.stringify([field, order]),
                // range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
                // ids: ids.toString(),
            };
            // console.log('Query params:', stringify(query));
            const options = {};
            options.headers = new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')});

            switch(resource) {
                case 'users':
                    return { url: `${API_URL}/${resource}/v1.0/org-access/?${stringify(query)}`, options};
                default:
                    // const query = {
                    //     filter: JSON.stringify({ id: params.ids }),
                    // };
                    // return { url: `${API_URL}/${resource}/?${stringify(query)}` };
                    throw new Error(`Unsupported fetch action type ${type}`);
            }
        }

        // Todo: Check if this is being used
        // case GET_MANY_REFERENCE: {
        //     const { page, perPage } = params.pagination;
        //     const { field, order } = params.sort;
        //     const query = {
        //         sort: JSON.stringify([field, order]),
        //         range: JSON.stringify([(page - 1) * perPage, (page * perPage) - 1]),
        //         filter: JSON.stringify({ ...params.filter, [params.target]: params.id }),
        //     };
        //     return { url: `${API_URL}/${resource}?${stringify(query)}` };
        // }

        case UPDATE:
            // console.log('Running UPDATE for:', resource);
            switch(resource) {
                case 'phi':
                    var body = {};
                    body.patient = {};
                    const updatedFields = params.data.updatedFields;
                    for (let i=0; i<updatedFields.length; i++){
                        const field = updatedFields[i];
                        if(field === 'dob') {
                            var date = params.data[field];
                            var month = date.getUTCMonth() + 1; //months from 1-12
                            var day = date.getUTCDate() + 1;
                            var year = date.getUTCFullYear();
                            if(day<10)  { day='0'+day } 
                            if(month<10)  { month='0'+month }
                            body.patient[field] = year+'-'+month+'-'+day;
                        }
                        else if(field != 'apartmentNo')
                            body.patient[field] = params.data[field];
                    }
                    if (updatedFields.indexOf('address') > -1 && updatedFields.indexOf('apartmentNo') > -1) {
                        params.data.address = {
                            "apartmentNo": params.data.apartmentNo,
                            "streetAddress": localStorage.getItem('streetAddress'),
                            "zipCode": localStorage.getItem('postalCode'),
                            "city": localStorage.getItem('cityName'),
                            "state": localStorage.getItem('stateName'),
                            "country": localStorage.getItem('countryName'),
                            "latitude": localStorage.getItem('latitude'),
                            "longitude": localStorage.getItem('longitude')
                        };
                        body.patient['address'] = params.data.address;
                    } else if (updatedFields.indexOf('address') > -1 ) {
                        params.data.address = {
                            "streetAddress": localStorage.getItem('streetAddress'),
                            "zipCode": localStorage.getItem('postalCode'),
                            "city": localStorage.getItem('cityName'),
                            "state": localStorage.getItem('stateName'),
                            "country": localStorage.getItem('countryName'),
                            "latitude": localStorage.getItem('latitude'),
                            "longitude": localStorage.getItem('longitude')
                        };
                        body.patient['address'] = params.data.address;
                    } 
                    else if(updatedFields.indexOf('apartmentNo') > -1){
                        params.data.address = {
                            "apartmentNo": params.data.apartmentNo
                        };
                        body.patient['address'] = params.data.address;
                    } 
                    body.id=params.data.id;
                    body.users=params.data.userIds;
                    body.physicianId = params.data.physician_id;
                    return {
                        url: `${API_URL}/${resource}/v1.0/patients/${params.id}/`,
                        options: { method: 'PUT', body: JSON.stringify(body), headers: new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')})},
                    };
                case 'physicians':
                    const updateBody = {
                        physician: {
                            npi : params.data.npiID,
                            firstName : params.data.firstName,
                            lastName : params.data.lastName,
                            phone1 : params.data.phone1,
                            phone2 : params.data.phone2,
                            fax : params.data.fax,
                        }};
                    return{
                        url: `http://localhost:8000/mock/v1.0/mock/${params.data.npiID}/`,
                        options: { method: 'PUT', body: JSON.stringify(updateBody)},
                    // options: { method: 'PUT', body: JSON.stringify(body), headers: new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')})},
                    }
                default:
                    console.log('ERROR! Edit called on invalid resources.');
                    return {};
            }

        case CREATE:
            // console.log('Running CREATE for:', resource);
            switch(resource) {
                case 'phi':
                    var request = {};
                    params.data.address = {
                        "apartmentNo": params.data.apartmentNo,
                        "streetAddress": localStorage.getItem('streetAddress'),
                        "zipCode": localStorage.getItem('postalCode'),
                        "city": localStorage.getItem('cityName'),
                        "state": localStorage.getItem('stateName'),
                        "country": localStorage.getItem('countryName'),
                        "latitude": localStorage.getItem('latitude'),
                        "longitude": localStorage.getItem('longitude')
                    };

                    request.patient = {};
                    request.patient.address = params.data.address;
                    request.patient.firstName = params.data.firstName;
                    request.patient.lastName = params.data.lastName;
                    request.patient.primaryContact = params.data.primaryContact;
                    request.patient.emergencyContactName = params.data.emergencyContactName;
                    request.patient.emergencyContactNumber = params.data.emergencyContactNumber;
                    request.patient.emergencyContactRelationship = params.data.emergencyContactRelationship;
                    if(params.data.dateOfBirth != null) {
                        var date = params.data.dateOfBirth;
                        var month = date.getUTCMonth() + 1; //months from 1-12
                        var day = date.getUTCDate() + 1;
                        var year = date.getUTCFullYear();
                        if(day<10)  { day='0'+day } 
                        if(month<10)  { month='0'+month }
                        request.patient.dob = year+'-'+month+'-'+day;
                    }
                    request.users = params.data.users;
                    request.physicianId = params.data.physician_id;
                    localStorage.removeItem('postalCode');
                    localStorage.removeItem('cityName');
                    localStorage.removeItem('stateName');
                    localStorage.removeItem('countryName');
                    localStorage.removeItem('latitude');
                    localStorage.removeItem('longitude');
                    localStorage.removeItem('streetAddress');

                    return {
                        url: `${API_URL}/${resource}/v1.0/patients/?format=json`,
                        options: { method: 'POST', headers: new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')}), body: JSON.stringify(request) },
                    };

                case 'physicians':
                    const request = {
                        physician: {
                            npi : params.data.npiID,
                            firstName : capitalize(params.data.firstName),
                            lastName : capitalize(params.data.lastName),
                            phone1 : params.data.phone1,
                            phone2 : params.data.phone2,
                            fax : params.data.fax,
                        }};
                    return {
                        url: `${API_URL}/phi/v1.0/physicians/?format=json`,
                        options: { method: 'POST', headers: new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')}), body: JSON.stringify(request) },
                    };
                default:
                    console.log('ERROR! CREATE called on invalid resources.');
                    return {};
            }

        case DELETE:
            // console.log('Running DELETE for:', resource);
            return {
                url: `${API_URL}/${resource}/v1.0/patients/${params.id}/`,
                options: { method: 'DELETE', headers: new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')}) },
            };

        default:
            throw new Error(`Unsupported fetch action type ${type}`);
    }
};

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} Data Provider response
 */
const convertHTTPResponseToDataProvider = (response, type, resource, params) => {
    console.log('Converting API Response to Data Provider:', params);
    const {json, headers} = response;
    switch (type) {

        case GET_LIST:
            // console.log('EXECUTED GET_LIST for:', resource);
            switch(resource) {
                case 'users':
                    const usersData = json.users.map(user => {
                        return ({
                            id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            contact_no: user.contact_no,
                            user_role: user.user_role,
                            username: user.username,
                            displayname: `${user.last_name}  ${user.first_name}, ${user.user_role}`,
                        });
                    });
                    return {
                        data: usersData,
                        total: 20,
                    };
                case 'phi':
                    const data = json.map(item => {
                        return ({
                            id: item.patient.id,
                            firstName: item.patient.firstName,
                            lastName: item.patient.lastName,
                            primaryContact: item.patient.primaryContact,
                            streetAddress: item.patient.address.streetAddress,
                            apartmentNo: item.patient.address.apartmentNo,
                            zipCode: item.patient.address.zipCode,
                            city: item.patient.address.city,
                            state: item.patient.address.state,
                            country: item.patient.address.country,
                            latitude: item.patient.address.latitude,
                            longitude: item.patient.address.longitude,
                            userIds: item.userIds
                        });
                    });
                    return {
                        //data: json.map(x => x),
                        data: data,
                        total: 20
                    };
                case 'physicians':
                    const physicianData = json.map(item => {
                        return ({
                            id: item.physicianID,
                            npi: item.npi,
                            firstName: item.firstName,
                            lastName: item.lastName,
                            phone1: item.phone1,
                            phone2: item.phone2,
                            fax: item.fax,
                            displayname: `${item.lastName} ${item.firstName}`
                        });
                    });
                    return {
                        //data: json.map(x => x),
                        data: physicianData,
                        total: 20
                    };
                default:
                    return {
                        data: json.map(x => x),
                        total: 20,
                    };
            }
        case GET_MANY:
            // console.log('EXECUTED GET_MANY for:', resource);
            switch(resource) {
                case 'users':
                    // console.log('Users are:', json.users);
                    const usersData = json.users.map(user => {
                        return ({
                            id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            contact_no: user.contact_no,
                            username: user.username,
                            displayname: `${user.last_name}  ${user.first_name}, ${user.user_role}`,
                        });
                    });
                    return {
                        data: usersData,
                        total: 20
                    };
                default:
                    return {
                        data: json.map(x => x),
                        total: 20,
                    };
            }


        // case CREATE:
        //     // console.log('Type:', type);
        //     // console.log('resource:', resource);
        //     // console.log('params.data:', params.data);
        //     console.log('Params:', params);
        //     console.log('id:', json.id);
        //     return { data: { ...params.data} };

        case GET_ONE:
            switch (resource) {
                case 'phi':
                    return {
                        data: {
                            "id": json.patient.id,
                            "firstName": json.patient.firstName,
                            "lastName": json.patient.lastName,
                            "primaryContact": json.patient.primaryContact,
                            "dob": json.patient.dob,
                            "emergencyContactName": json.patient.emergencyContactName,
                            "emergencyContactNumber": json.patient.emergencyContactNumber,
                            "emergencyContactRelationship": json.patient.emergencyContactRelationship,
                            "streetAddress": json.patient.address.streetAddress,
                            "apartmentNo": json.patient.address.apartmentNo,
                            "latitude": json.patient.address.latitude,
                            "longitude": json.patient.address.longitude,
                            "city": json.patient.address.city,
                            "state": json.patient.address.state,
                            "country": json.patient.address.country,
                            "zipCode": json.patient.address.zipCode,
                            "userIds": json.userIds,
                            "physician_id": json.physicianId,
                        }
                    };
                case 'physicians':
                    return {
                        data: {
                            "id": json.physicianID,
                            "firstName": json.firstName,
                            "lastName": json.lastName,
                            "phone1": json.phone1,
                            "phone2": json.phone2,
                            "fax": json.fax,
                            "displayname": `${json.lastName} ${json.firstName}`
                        }
                    };
                default:
                    return {data: json};
            }

        default:
            return {data: json};
    }
};

/**
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for response
 */
export default (type, resource, params) => {
    const { fetchJson } = fetchUtils;
    const {url, options} = convertDataProviderRequestToHTTP(type, resource, params);
    return fetchJson(url, options)
        .then(response => convertHTTPResponseToDataProvider(response, type, resource, params));
};