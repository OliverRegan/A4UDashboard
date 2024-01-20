export const SetCookie = (cookieName, cookieValue, expiryInDays, path) => {

    try {
        const date = new Date();

        date.setTime(date.getTime() + (expiryInDays * 24 * 60 * 60 * 1000)); // current time + days in ms
        console.log(date)
        const expireString = "expires=" + date.toString();
        const pathString = path === "" ? "/" : path
        console.log(expireString)
        console.log(pathString)
        console.log(cookieValue)
        console.log(cookieName)
        document.cookie = `${cookieName}=${cookieValue};${expireString};path=${pathString}`

        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }


}

// Parse cookies looking for one in question
export const GetCookie = (cookieValue) => {

    const name = cookieValue + "=";

    const decodedCookie = decodeURIComponent(document.cookie);

    const cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {

        let cookie = cookieArray[i];

        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1);
        }

        if (cookie.indexOf(name) === 0) {

            return cookie.substring(name.length, cookie.length);

        }

    }

    return false; // False value if cookie doesn't exist

}
