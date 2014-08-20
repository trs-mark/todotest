exports.definition = {
	config: {
		
		adapter:{
			"type":"sql",
			"collection_name":"tasks",
			"db_file": "/todotest.sqlite",
			"db_name": "todotest",
			"idAttribute": "id",
			"remoteBackup":false
		}
	}
};
