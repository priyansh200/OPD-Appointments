export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();
    const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
    const parsedStatusCode = parseInt(statusCode.toString(), 10);
    //const parsedCookieExpire = parseInt(process.env.COOKIE_EXPIRE || "0", 10);
    return res
        .status(parsedStatusCode)
        .cookie(cookieName, token, {
       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

        httpOnly: true,
    })
        .json({
        success: true,
        message,
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
        token,
    });
};
