const { nextTick } = require("async");

function loginauth() {
    if(require.session.name!=unidenfied){
        next();
    }
    else if (require.session.name==unidenfied){
        response.send('/')
    }
}
module.exports = loginauth;