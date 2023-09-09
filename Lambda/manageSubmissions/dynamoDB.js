var AWS = require("aws-sdk");

async function queryitems_dynamodb(
  region,
  table_name,
  expr_attr_values,
  key_cond_expr,
  proj_expr,
  creator,
  pageNumber,
  searchInput
) {
  console.log("In the queryitems_dynamodb method...");
  var dynamodb = new AWS.DynamoDB.DocumentClient({ region: region });
  var index = 0;
  var count = 0;

  async function search(err, data) {
    console.log(data);
    if (err) {
      console.log("Search Error");
    } else {
      console.log("Successfully Searched");
      console.log(params);
      data.Items.forEach(function (itemData, index) {
        console.log("Item :", ++count, JSON.stringify(itemData));
      });

      if (data.LastEvaluatedKey) {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        return dynamodb.query(params, search);
      }
    }
  }

  try {
    var params = {
      TableName: "file",
      IndexName: "created_by_id-file_id-index",
      KeyConditionExpression: "#createdBy = :creator",
      ExpressionAttributeNames: {
        "#createdBy": "created_by_id",
      },
      ExpressionAttributeValues: {
        ":creator": creator,
      },
      ScanIndexForward: true,
    };

    // Conditionally add the FilterExpression if searchInput is not empty
    if (searchInput && searchInput.trim().length > 0) {
      params.FilterExpression = "contains(design_title, :searchInput)";
      params.ExpressionAttributeValues[":searchInput"] = searchInput;
    }

    const results = await dynamodb.query(params, search).promise();
    return results;
  } catch (tryerror) {
    console.log("Error occurred in dynamodb.query..");
    console.log(tryerror, tryerror.stack); // an error occurred
  }
} //end function

module.exports = queryitems_dynamodb;
