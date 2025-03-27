import { BASEURL } from "../config";
import {client} from '@passwordless-id/webauthn'

async function login(username, password, deviceName = '') {
    const response = await fetch(BASEURL + '/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ username, password, deviceName })
    });
    const data = await response.json();
    if (data.success) {
        console.log('Login successful', data);
    } else {
        console.error('Login failed', data.data.message);
    }
    return data;
}

async function register(username, password) {
    const response = await fetch(BASEURL + '/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.success) {
        console.log('Registration successful', data);
    } else {
        console.error('Registration failed', data.data.message);
    }
    return data;
}

async function deleteAccount(username, password) {
    const response = await fetch(BASEURL + '/api/v1/auth/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.success) {
        console.log('Account deleted successfully', data);
    } else {
        console.error('Account deletion failed', data.data.message);
    }
    return data;
}

async function getDevices() {
    const response = await fetch(BASEURL + '/api/v1/auth/devices', {
        method: 'GET',
        credentials: 'include' // Send cookies
    });
    const data = await response.json();
    if (data.success) {
        console.log('Devices retrieved', data.data);
    } else {
        console.error('Failed to retrieve devices', data.data.message);
    }
    return data;
}

async function getUserInfo(userID = null) {
    let url = userID ? BASEURL + '/api/v1/auth/userinfo?userID=' + userID : BASEURL + '/api/v1/auth/userinfo'
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
    });
    const data = await response.json();
    if (data.success) {
        console.log('User info retrieved', data.data);
    } else {
        console.error('Failed to retrieve user info', data.message);
    }
    return data;
}

async function logout() {
    const response = await fetch(BASEURL + '/api/v1/auth/logout', {
        method: 'GET',
        credentials: 'include' // Send cookies
    });
    const data = await response.json();
    if (data.success) {
        console.log('Logout successful', data);
    } else {
        console.error('Logout failed', data.data.message);
    }
    return data;
}

async function removeDevice(deviceID) {
    const response = await fetch(BASEURL + '/api/v1/auth/removedevice', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ deviceID })
    });
    const data = await response.json();
    if (data.success) {
        console.log('Device removed successfully', data);
    } else {
        console.error('Failed to remove device', data.data.message);
    }
    return data;
}

async function changePassword(oldpass, newpass) {
    const response = await fetch(BASEURL + '/api/v1/auth/changepass', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ oldpass, newpass })
    });
    const data = await response.json();
    if (data.success) {
        console.log('Password changed successfully', data);
    } else {
        console.error('Failed to change password', data.data.message);
    }
    return data;
}


async function getWebAuthnChallenge() {
    const response = await fetch(BASEURL + '/api/v1/auth/webauthn/challenge', {
        method: 'GET'
    });
    const data = await response.json();
    if (data.challenge) {
        console.log('Challenge retrieved', data.challenge);
    } else {
        console.error('Failed to retrieve challenge');
    }
    return data.challenge;
}

async function registerWebAuthn(username, password, registration, challenge) {
    const response = await fetch(BASEURL + '/api/v1/auth/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ username, password, registration, challenge }),
    });
    const data = await response.json();
    if (data.success) {
        console.log('WebAuthn registration successful', data);
    } else {
        console.error('WebAuthn registration failed', data.data.message);
    }
    return data;
}

async function authenticateWebAuthn(username, challenge, authentication) {
    const response = await fetch(BASEURL + '/api/v1/auth/webauthn/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ username, challenge, authentication })
    });
    const data = await response.json();
    if (data.success) {
        console.log('WebAuthn authentication successful', data);
    } else {
        console.error('WebAuthn authentication failed', data.data.message);
    }
    return data;
}

async function checkIfLoggedIn() {
    let userinfo = await getUserInfo();
    console.log(userinfo);
    if (userinfo.success == false) {
        return false;
    }

    return true;
}

function getExtraInfo(userID) {
    return new Promise(async (resolved, rejected) => {
        fetch(BASEURL + "/api/v1/auth/extrainfo?userID=" + userID, { credentials: "include" }).then(async (info) => {
            info = await info.json();
            console.log(info);
            if (info.success == true) {
                //load info to inputs
                info = info.data;
                console.log(info);
                resolved(info)
            } else {
                rejected(info)
            }
        })

    })

}

function postExtraInfo(fullname, bio) {
    return new Promise((resolved, rejected) => {
        fetch(BASEURL + "/api/v1/auth/extrainfo", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                data: {
                    fullname: fullname,
                    bio: bio
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (res) => {
            res = await res.json();
            if (res.success == true) {
                resolved();
            } else {
                rejected(res);
                console.error(res);
            }
        }).catch((err) => {
            console.error(err);
            rejected(err);
        })
    })
}

function changePfp() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpg, image/jpeg, image/png";

    fileInput.addEventListener("change", async () => {
        if (!fileInput.files.length) {
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();

        formData.append('image', file);

        try {
            const response = await fetch(BASEURL + '/api/v1/auth/pfp', {
                method: 'POST',
                credentials: "include",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                window.alert(`File uploaded successfully: ${result.message}`);
                location.reload();
            } else {
                window.alert(`Error uploading file: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            window.alert(`Failed to upload file`);
        }
    })

    fileInput.click();
}


//webauthn things
//TODO: rewrite this legacy shit

const httprequest = (method, endpoint, body, isJson = false) => {
    return new Promise((resolved) => {
        let req = new XMLHttpRequest();
        req.open(method, endpoint);
        if (isJson) {
            req.setRequestHeader("Content-Type", "application/json")
        }
        req.addEventListener("loadend", () => {
            console.log(req.responseText);
            resolved(req.responseText);
        })
        req.send(body);
    });

}

const passkeyAuth = async (devname) => {
    let challenge = JSON.parse(await httprequest("GET", BASEURL + "/api/v1/auth/webauthn/challenge"))["challenge"];

    const authentication = await client.authenticate({
        /* Required */
        challenge: challenge,
        timeout: 60000
    })

    console.log(authentication)

    let response = JSON.parse(await httprequest("POST", BASEURL + "/api/v1/auth/webauthn/auth", JSON.stringify({ authentication, challenge, deviceName: devname }), true));
    console.log(response)
    return response

}

export { login, register, checkIfLoggedIn, changePassword, authenticateWebAuthn, deleteAccount, getDevices, getUserInfo, getWebAuthnChallenge, logout, registerWebAuthn, removeDevice, getExtraInfo, postExtraInfo, changePfp, passkeyAuth }