export async function sendRequest(url, cfg) {

    try {

        const response = await fetch(url, cfg);
        const data = await response.json();

        if (!response.ok) {
            console.log(data.msg);
            throw new Error(data.msg);
        }

        return Promise.resolve(data);

    } catch (error) {

        return Promise.reject(error);
    }
}

//--------------------------------------------------------------
export function sanitizeString(str) {
    if (!str) {
        return;
    }
    str = str.replace(/[^a-zA-Z0-9 æøåÆØÅ.,_@-]/g, "");
    return str.trim();
}

//--------------------------------------------------------------
export function createBasicAuthString(username, password) {
    let combinedStr = username + ":" + password;
    let b64Str = btoa(combinedStr);
    return "basic " + b64Str;
}

//---------------------------------------------------------------------
export function convertDate(value) {
    const date = new Date(value);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`
}

//---------------------------------------------------------------------
export function checkLength(value) {
    let number = value;

    if (number.toString().length == 1) {
        number = "0" + number;
        return number;
    } else {
        return number;
    }
}

//---------------------------------------------------------------------
export function checkToken() {
    const adminToken = sessionStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");
    const token = !adminToken ? userToken : adminToken;

    return token;
}
