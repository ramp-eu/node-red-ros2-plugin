// RED argument provides the module access to Node-RED runtime api
module.exports = function(RED)
{
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
}
