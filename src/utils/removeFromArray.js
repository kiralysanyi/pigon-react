/**
 * // Simple function to remove a value from an array
 * @param {Array} array Any array
 * @param {*} value Any value you wish to remove from the array
 * @returns New array without the specified value
 */
function removeFromArray(array, value) {
    const newArray = array.filter(item => item !== value);
    return newArray
}

export default removeFromArray