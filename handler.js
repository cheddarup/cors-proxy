const p = require("phin");

module.exports.corsProxy = async (event, context) => {
  let params = event.queryStringParameters;

  if (!params.url) {
    return {
      statusCode: 400,
      body: "Unable get url from 'url' query parameter"
    };
  }

  try {
    const res = await p({
      url: params.url,
      method: event.httpMethod,
      data: event.body ? JSON.parse(event.body) : null,
      timeout: 20000
    });
    const response = {
      statusCode: res.statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        ...res.headers
      },
      body: res.body.toString('base64'),
      isBase64Encoded: true
    };
    return response;
  } catch (err) {
    console.log(`Got error`, event, params, err);
    return {
      statusCode: 400,
      body: err.msg
    };
  }
};
