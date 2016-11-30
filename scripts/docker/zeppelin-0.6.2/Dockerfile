FROM 1ambda/zeppelin-base:latest

ENV Z_VERSION="0.6.2"
ENV Z_HOME="/usr/local/zeppelin"
ENV START_BIN="start.sh"

# separate wget and tar layer so that we can change the CMD layer easily
RUN wget https://www.apache.org/dist/zeppelin/zeppelin-${Z_VERSION}/zeppelin-${Z_VERSION}-bin-all.tgz
RUN tar -zxvf zeppelin-${Z_VERSION}-bin-all.tgz && \
    rm -rf zeppelin-${Z_VERSION}-bin-all.tgz
RUN mv /zeppelin-${Z_VERSION}-bin-all $Z_HOME

# ENV SPARK_VERSION="2.0.0"
# ENV HADOOP_VERSION="2.3"
# ENV SPARK_PREFIX="spark-${SPARK_VERSION}-bin-without-hadoop"
# ENV SPARK_PREFIX="spark-${SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}"

# get spark
# RUN wget http://d3kbcqa49mib13.cloudfront.net/${SPARK_PREFIX}.tgz
# RUN tar -xvzf ${SPARK_PREFIX}.tgz && \
#     rm -rf ${SPARK_PREFIX}.tgz
# RUN mv ${SPARK_PREFIX} /spark
# RUN echo "export SPARK_HOME=/spark" > $Z_HOME/conf/zeppelin-env.sh
# RUN chmod 777 -R $Z_HOME/*

# setup bootstrap script
ADD $START_BIN "/$START_BIN"
RUN chmod a+x "/$START_BIN"

EXPOSE 4040 7072 7077 8080 8081 8082

# CMD doesn't support env variables
CMD ["--", "./start.sh"]
