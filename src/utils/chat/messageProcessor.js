
function sanitizeInput(input) {
    // Replace characters that could break JSON
    return input.replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/"/g, '\\"')   // Escape double quotes
        .replace(/</g, '&lt;') // Escape < to prevent HTML injection
        .replace(/>/g, '&gt;') // Escape > to prevent HTML injection
        .replace(/&/g, '&amp;') // Escape &
        .replace(/'/g, '&#39;'); // Escape single quotes
}

function decodeHTML(text) {
    console.log("Decode:", text)
    if (!text) return "";

    const parser = new DOMParser();
    const decodedString = parser.parseFromString(text, "text/html").body.textContent;
    console.log("Decoded:", decodedString)
    return decodedString;
}

/**
 * Function for sanitizing a message
 * @param {string} messageContent Content of the message, only suitable for text messages
 * @returns {string} Sanitized message
 */
function messageProcessor(messageContent) {
    return decodeHTML(decodeHTML(messageContent))
}

export default messageProcessor;