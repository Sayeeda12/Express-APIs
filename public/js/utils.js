module.exports = {
    setResponse: function(msg, code) {
        return  {
                    status: (code == undefined) ? 200 : code,
                    response: {response: msg}
                };
    }
}