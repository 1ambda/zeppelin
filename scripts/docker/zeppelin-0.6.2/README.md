### Build

```
docker build . -t 1ambda/zeppelin-docker:0.6.2
```

### Run

```
docker run --rm -it -p 4040:4040 -p 8080:8080 -p8081:8081 -p 8082:8082 -p 7072:7072 -p 7077:7077 1ambda/zeppelin-docker:0.6.2
```

