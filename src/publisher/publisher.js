// RED argument provides the module access to Node-RED runtime api
module.exports = function(RED)
{
    var fs = require('fs');
    /* 
     * @function PublisherNode constructor
     * This node is defined by the constructor function PublisherNode, 
     * which is called when a new instance of the node is created
     * 
     * @param {Object} config - Contains the properties set in the flow editor
     */
    function PublisherNode(config)
    {
        // Initiliaze the features shared by all nodes
        RED.nodes.createNode(this, config);
        this.props = config.props;
        var node = this;

        RED.events.on("deploy", function() {
            console.log("Deployed");
        });

        // Registers a listener to the input event, 
        // which will be called whenever a message arrives at this node
        node.on('input', function(msg) 
        {
            node.status({ fill: "green", shape: "dot", text: "message"});

            // Passes the message to the next node in the flow
            node.send(msg);
        });
    }

    // The node is registered in the runtime using the name publisher
    RED.nodes.registerType("publisher", PublisherNode);

    //Function that sends to the html file the qos descriptions read from the json file
    RED.httpAdmin.get("/pubqosdescription", RED.auth.needsPermission('publisher.read'), function(req,res) 
    {
        var description_path = __dirname + "/../qos-description.json";  
        var rawdata  = fs.readFileSync(description_path);
        let json = JSON.parse(rawdata);
        res.json(json);
    });
}
