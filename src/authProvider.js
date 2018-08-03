import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';

//const API_URL = 'https://app-9707.on-aptible.com/get-token/';
//const API_URL = 'https://app-9781.on-aptible.com/get-token/';
const API_URL = 'http://localhost:8000/get-token/';

export default (type, params) => {
    // called when the user attempts to log in
    if (type === AUTH_LOGIN) {
        const { username, password } = params;
        const request = new Request(API_URL, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json'
            }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then(({ token }) => {
                localStorage.setItem('access_token', token);
                // TODO logic to be changed based on the logged in Org
                localStorage.setItem('organizationName', 'Freudenthal Home Health');
            });
        // accept all username/password combinations
    }
    // called when the user clicks on the logout button
    if (type === AUTH_LOGOUT) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('organizationName');
        return Promise.resolve();
    }
    // called when the API returns an error
    if (type === AUTH_ERROR) {
        const { status } = params;
        if (status === 401 || status === 403) {
            localStorage.removeItem('access_token');
            return Promise.reject();
        }
        return Promise.resolve();
    }
    // called when the user navigates to a new location
    if (type === AUTH_CHECK) {
        return localStorage.getItem('access_token')
            ? Promise.resolve()
            : Promise.reject();
    }
    return Promise.reject('Unknown method');
};