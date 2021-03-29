// RED argument provides the module access to Node-RED runtime api
module.exports = function(RED)
{
    var execFile = require('child_process').execFile;
    var fs = require('fs');
    var home = process.env.HOME;

    /* 
     * @function IDLType constructor
     * This node is defined by the constructor function IDLType, 
     * which is called when a new instance of the node is created
     * 
     * @param {Object} config - Contains the properties set in the flow editor
     */
    function IDLType(config)
    {
        // Initiliaze the features shared by all nodes
        RED.nodes.createNode(this, config);
        var node = this;

        // Registers a listener to the input event, 
        // which will be called whenever a message arrives at this node
        node.on('input', function(msg) 
        {
            node.status({ fill: "green", shape: "dot", text: "message"});

            // Passes the message to the next node in the flow
            node.send(msg);
        });
    }

    // The node is registered in the runtime using the name IDL Type
    RED.nodes.registerType("IDL Type", IDLType);
    RED.library.register("idl-type");

    //Function that pass the IS ROS 2 package compiled msgs to the html file
    RED.httpAdmin.get("/checkidl", RED.auth.needsPermission('IDL Type.read'), function(req,res) 
    {
        var parser_path = home + "/idl_parser_path.txt";
        var line  = fs.readFileSync(parser_path).toString();
        var index = line.indexOf('\n');
        var path = line;
        if (index != -1)
        {
            path = line.substr(0, index);
        }
        
        execFile(path + "/xtypes_idl_validator", [String(req.query["idl"])], function(error, stdout, stderr) {
            if (error) {
            // the *entire* stdout (buffered)
            var init_index = stdout.indexOf('PEGLIB_PARSER:');
            var end_index = stdout.indexOf('RESULT:');
            if (init_index != -1 && end_index != -1)
            {
                var err_msg = stdout.substr(init_index, end_index - init_index - 8 /*DEBUG CODE*/);
                res.json(err_msg);
            }
            return;
            }
        });
    });
}
               