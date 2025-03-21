import { BASEURL } from "../config";

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
    return data.data;
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
    const body = userID ? JSON.stringify({ userID }) : null;
    const response = await fetch(BASEURL + '/api/v1/auth/userinfo', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: body
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

export { login, register, checkIfLoggedIn, changePassword, authenticateWebAuthn, deleteAccount, getDevices, getUserInfo, getWebAuthnChallenge, logout, registerWebAuthn, removeDevice }