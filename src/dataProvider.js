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
import { stringify } from 'query-string';

const API_URL = 'http://app-9707.on-aptible.com';

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
const convertDataProviderRequestToHTTP = (type, resource, params) => {
    switch (type) {
    case GET_LIST: {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            format: 'json',
            // sort: JSON.stringify([field, order]),
            // range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            // filter: JSON.stringify(params.filter),
        };
        const options = {};
        options.headers = new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')});
        if(resource === 'users/') {
            return { url: `${API_URL}/${resource}v1.0/org-access?${stringify(query)}`, options};
        }
        return { url: `${API_URL}/${resource}v1.0/patients?${stringify(query)}`, options};
    }
    case GET_ONE:
        const options = {};
        options.headers = new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')});
        return { url: `${API_URL}/${resource}v1.0/patients/${params.id}`, options };
    case GET_MANY: {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return { url: `${API_URL}/${resource}/?${stringify(query)}` };
    }
    case GET_MANY_REFERENCE: {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, (page * perPage) - 1]),
            filter: JSON.stringify({ ...params.filter, [params.target]: params.id }),
        };
        return { url: `${API_URL}/${resource}?${stringify(query)}` };
    }
    case UPDATE:
        var request = {};
        request.users=params.data.users;
        request.firstName=params.data.firstName;
        request.lastName=params.data.lastName;
        request.id=params.data.id;
        request.primaryContact=params.data.primaryContact;
        console.log(request);
        return {
            url: `${API_URL}/${resource}v1.0/patients/${params.id}/`,
            options: { method: 'PUT', body: JSON.stringify(request), headers: new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')})},
        };
    case CREATE:
        var request = {};
        params.data.address={"apartment_no": params.data.apartment_no,
            "streetAddress": params.data.address,
            "zipCode": localStorage.getItem('postalCode'),
            "city": localStorage.getItem('cityName'),
            "state": localStorage.getItem('stateName'),
            "country": localStorage.getItem('countryName'),
            "latitude": localStorage.getItem('latitude'),
            "longitude": localStorage.getItem('longitude') };

            request.patient = {};
            request.patient.address = params.data.address;
            request.patient.firstName = params.data.firstName;
            request.patient.lastName = params.data.lastName;
            request.patient.primaryContact = params.data.primaryContact;
            request.patient.emergencyContact = params.data.secondaryContact;
            request.users = params.data.users;
            console.log(JSON.stringify(request));
            localStorage.removeItem('postalCode');
            localStorage.removeItem('cityName');
            localStorage.removeItem('stateName');
            localStorage.removeItem('countryName');
            localStorage.removeItem('latitude');
            localStorage.removeItem('longitude');
        
        return {
            url: `${API_URL}/${resource}v1.0/patients/?format=json`,
            options: { method: 'POST', headers: new Headers({Authorization: 'Token '+ localStorage.getItem('access_token')}), body: JSON.stringify(request) },
        };
    case DELETE:
        return {
            url: `${API_URL}/${resource}v1.0/patients/${params.id}`,
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
    const { headers, json } = response;
        console.log(json);
    switch (type) {
        case GET_LIST:
            if(resource === 'users/') {
                return {
                    data: json.users.map(x => x),
                    total: 20
                }
            }
            return {
                data: json.map(x => x),
                total: 20,
            };
        case CREATE:
            return { data: { ...params.data, id: json.id } };
        case GET_ONE:
            return { data: {
                "id": json.id,
                "firstName": json.patient.firstName,
                "lastName": json.patient.lastName,
                "primaryContact": json.patient.primaryContact
            }  };
        default:
            return { data: json};
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
    const { url, options } = convertDataProviderRequestToHTTP(type, resource, params);
    return fetchJson(url, options)
        .then(response => convertHTTPResponseToDataProvider(response, type, resource, params));
};