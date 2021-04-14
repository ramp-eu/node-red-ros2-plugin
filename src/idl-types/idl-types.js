// RED argument provides the module access to Node-RED runtime api
module.exports = function(RED)
{
    var execFile = require('child_process').execFile;
    var fs = require('fs');
    var is_web_api = require('/usr/lib/IS-Web-API/configuration');
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
        
        let {color, message} = is_web_api.add_idl_type(config["idltype"], config["name"]);
        if (message && color)
        {
            node.status({ fill: color, shape: "dot", text: message});
        }

        // Event emitted when the deploy is finished
        RED.events.once('flows:started', function() {
            let {color, message} = is_web_api.launch(config['id']);
            if (message && color)
            {
                node.status({ fill: color, shape: "dot", text: message});
            }
        });

        // Registers a listener to the input event, 
        // which will be called whenever a message arrives at this node
        node.on('input', function(msg) 
        {
            // Passes the message to the next node in the flow
            node.send(msg);
        });

        // Called when there is a re-deploy or the program is closed 
        node.on('close', function()
        {
            // Stops the IS execution and resets the yaml
            is_web_api.new_config();
            is_web_api.stop();
        });
    }

    // The node is registered in the runtime using the name IDL Type
    RED.nodes.registerType("IDL Type", IDLType);
    RED.library.register("idl-type");

    // Function that parse the IDL Type defined by the user and returns the parsing result to the html
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
        
        // Execute the command line xtypes validator with the idl set by the user
        execFile(path + "/xtypes_idl_validator", [String(req.query["idl"])], function(error, stdout, stderr) {
            if (error) 
            {
                var init_index = stdout.indexOf('PEGLIB_PARSER:');
                var end_index = stdout.indexOf('[DEBUG] RESULT:');
                if (init_index != -1 && end_index != -1)
                {
                    // If the validator returns an error it is passed to the html
                    var err_msg = stdout.substr(init_index, end_index - init_index);
                    res.json(err_msg);
                }
                return;
            }
        });
    });
}
               
