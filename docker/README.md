## How to build an image

The [Dockerfile](https://github.com/ramp-eu/node-red-ros2-plugin/blob/feature/ros2-connection/docker/Dockerfile) associated with this repository can
be used to build a docker image:

```console
docker build -f Dockerfile -t node-red-ros2-plugin .
```

## How to use the plugin 

- First run the already created docker image:

```console
docker run --rm --net=host -ti node-red-ros2-plugin
```
- Execute the [Integration Service](https://github.com/eProsima/soss) bash script
```console
. /opt/is/local_setup.bash
```
- Run Node-RED using `/data/` as user directory:

```console
node-red -u /data
```

- Open a browser and go to [http://localhost:1880/](http://localhost:1880/)
