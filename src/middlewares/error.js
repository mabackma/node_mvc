export const catchError = (err, req, res, next) => {
    const msg = err.toString()
    res.render('error/error', { msg: msg })
}