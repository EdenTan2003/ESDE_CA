var
    AWS = require("aws-sdk"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    }),
    file_DATA_ARR = require("./fileData.json");

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
		    			file_id: {
		    				"N": file_DATA_ARR[i_int].file_id.toString()
		    			},
		    			cloudinary_file_id: {
		    				"S": file_DATA_ARR[i_int].cloudinary_file_id
		    			},
		    			cloudinary_url: {
		    				"S": file_DATA_ARR[i_int].cloudinary_url
		    			},
		    			design_title: {
		    				"S": file_DATA_ARR[i_int].design_title
		    			},
		    			design_description: {
		    				"S": file_DATA_ARR[i_int].design_description
		    			},
		    			created_by_id: {
		    				"N": file_DATA_ARR[i_int].created_by_id.toString()
		    			}
		    		}
		    	}
		    };
	    	file_formatted_arr.push(file);
	    	item_added_count = item_added_count + 1
		}
		params = {
			RequestItems: {
				"file": file_formatted_arr.reverse()
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