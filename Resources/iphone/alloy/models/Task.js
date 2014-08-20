exports.definition = {
    config: {
        adapter: {
            type: "sql",
            collection_name: "tasks",
            db_file: "/db.sqlite",
            db_name: "db",
            idAttribute: "id",
            remoteBackup: false
        }
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("task", exports.definition, []);

collection = Alloy.C("task", exports.definition, model);

exports.Model = model;

exports.Collection = collection;