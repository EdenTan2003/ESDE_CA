var
    AWS = require("aws-sdk"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    }),
    file_DATA_ARR = require("./userData.json");

function addNewItemsFromJSON(){
	console.log("All items now removed, re-seeding now");
	var 
		file = {},
		num_items_left = file_DATA_ARR.length,
		offset_index = 0;
	console.log('num_items_left initial', num_items_left)

	while(num_items_left > 0){
		var
			file_formatted_arr = [],
			params = {},		
			item_added_count = 0;
		for(var i_int = offset_index; i_int < offset_index+Math.min(25, num_items_left); i_int += 1){
			file = {
		    	PutRequest: {
		    		Item: {
                        user_id: {
                            "N": file_DATA_ARR[i_int].user_id.toString()
                        },
                        fullname: {
                            "S": file_DATA_ARR[i_int].fullname
                        },
                        email: {
                            "S": file_DATA_ARR[i_int].email
                        },
                        user_password: {
                            "S": file_DATA_ARR[i_int].user_password
                        },
                        role_id: {
                            "N": file_DATA_ARR[i_int].role_id.toString()
                        }
                    }
		    	}
		    };
	    	file_formatted_arr.push(file);
	    	item_added_count = item_added_count + 1
		}
		params = {
			RequestItems: {
				"user": file_formatted_arr.reverse()
			}
		};
		DDB.batchWriteItem(params, function(err, data){   
			if(err){
				throw err;
			}
			console.log("OK");         
		});
		num_items_left = num_items_left-item_added_count;
		offset_index = offset_index+item_added_count;
		console.log('num_items_left', num_items_left)
	}
}

(function init(){
	addNewItemsFromJSON();
})();