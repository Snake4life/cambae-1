ARG ELK_VERSION

# https://github.com/elastic/logstash-docker
FROM docker.elastic.co/logstash/logstash-oss:6.5.4

RUN logstash-plugin install logstash-input-beats
RUN logstash-plugin install logstash-filter-json

COPY ./config/logstash.yml /usr/share/logstash/config/logstash.yml
COPY ./pipeline/logstash.conf /usr/share/logstash/pipeline/logstash.conf
# Add your logstash plugins setup here
# Example: RUN logstash-plugin install logstash-filter-json
