var AWS = require("aws-sdk");

async function updateitems_dynamodb(
  region,
  table_name,
  expr_attr_values,
  key_cond_expr,
  proj_expr,
  design_Desc,
  design_Title
) {
  console.log("In the queryitems_dynamodb method...");
  var dynamodb = new AWS.DynamoDB({ region: region });
  try {
    var params = {
      Key: {
        file_id: {
          N: String(expr_attr_values),
        },
      },
      ExpressionAttributeValues: {
        ":dD": {
          S: design_Desc,
        },
        ":dT": {
          S: design_Title,
        },
      },
      TableName: table_name,
      UpdateExpression: `SET design_description=:dD, design_title=:dT`,
    };

    return dynamodb.updateItem(params, function (err, data) {
      console.log(err, data);
    });
  } catch (tryerror) {
    console.log("Error occurred!");
    console.log(tryerror, tryerror.stack); // an error occurred
  }
} //end function

module.exports = updateitems_dynamodb;
