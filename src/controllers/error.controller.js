const _this = {
    error: (err, req, res, next) => {
        if (err.isBoom) {
            return res.status(err.output.statusCode).json(err.output.payload);
        }
    }
}

module.exports = _this;