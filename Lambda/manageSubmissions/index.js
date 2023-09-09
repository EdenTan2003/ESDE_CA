var dynamodbQuery = require("dynamoDB");

exports.handler = async function (event, context, callback) {
  if (event.userId || event.queryStringParameters.userId) {
    if (event.userId) var creator = parseInt(event.userId);
    else var creator = parseInt(event.queryStringParameters.userId);

    var region = "us-east-1";
    var table_name = "file";
    var expr_attr_values = { ":creator": creator };
    var key_cond_expr = "created_by_id=:creator";
    var proj_expr =
      "file_id,cloudinary_url,design_title,design_description,created_by_id";
    var pageNum = parseInt(event.pageNumber);

    var searchInput; // Initialize searchInput with an empty string
    if (
      event.queryStringParameters &&
      event.queryStringParameters.searchInput
    ) {
      searchInput = event.queryStringParameters.searchInput || null;
    } else {
      searchInput = event.searchInput || null;
    }

    await dynamodbQuery(
      region,
      table_name,
      expr_attr_values,
      key_cond_expr,
      proj_expr,
      creator,
      pageNum,
      searchInput
    )
      .then((data) => {
        console.log("Successfully got items from dynamodb.query");
        console.log(data);
        var responseCode = 200;
        var totalNumberOfRecords = data.Count;
        var jsonResult = {
          filedata: data.Items,
          total_number_of_records: totalNumberOfRecords,
        };
        let response = {
          statusCode: responseCode,
          body: JSON.stringify(jsonResult),
          headers: {
            "Access-Control-Allow-Headers": "Content-Type,user",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          },
        };
        console.log("response: " + JSON.stringify(response));
        callback(null, response);
      })
      .catch((error) => {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
        var responseCode = 500;

        let response = {
          statusCode: responseCode,
          body: JSON.stringify(error),
        };

        console.log("response: " + JSON.stringify(response));
        callback(null, response);
      });
  } //end if
};
