FROM ros:foxy

# BEWARE: shared memory will not work by default with this Docker.
# Please run it with -v /dev/shm:/dev/shm option or compile the docker image with FastDDS with no SHM_DEFAULT=ON.

# Dependencies
RUN apt-get install -f
RUN apt-get update

# Install Integration Service dependencies
RUN apt-get install -y libyaml-cpp-dev
RUN apt-get install -y libboost-dev
RUN apt-get install -y libboost-program-options-dev
RUN apt-get install -y libwebsocketpp-dev

# Install node.js
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
RUN chmod +x nodesource_setup.sh && sudo sh -c ./nodesource_setup.sh
RUN apt-get install -y nodejs

# Install Node-RED
RUN npm install -g --unsafe-perm node-red

# Prepare Integration Service workspace
RUN apt-get install -y git
RUN mkdir -p /is_ws/src
WORKDIR /is_ws/src
RUN git clone https://github.com/eProsima/soss.git -b feature/node-red-support is
RUN git clone https://github.com/eProsima/xtypes.git --recursive xtypes
WORKDIR /is_ws

# Compile the Integration Service
RUN . /opt/ros/foxy/setup.sh && \
    colcon build --packages-up-to soss-ros2-test soss-websocket-test --cmake-args -DCMAKE_BUILD_TYPE=RELEASE --install-base /opt/is

# Install node-red-plugin
RUN mkdir -p /nodered_ws/src
WORKDIR /nodered_ws/src
RUN git clone https://github.com/ramp-eu/node-red-ros2-plugin.git -b feature/first_nodes
WORKDIR /usr/lib
RUN npm install /nodered_ws/src/node-red-ros2-plugin

