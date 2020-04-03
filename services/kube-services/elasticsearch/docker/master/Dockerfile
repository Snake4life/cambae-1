ARG ELK_VERSION

# https://github.com/elastic/elasticsearch-docker
FROM docker.elastic.co/elasticsearch/elasticsearch:6.5.4

COPY ./elasticsearch-master.yml /usr/share/elasticsearch/config/elasticsearch.yml
COPY ./users /usr/share/elasticsearch/config/users
COPY ./user_roles /usr/share/elasticsearch/config/user_roles
# Add your elasticsearch plugins setup here
# Example: RUN elasticsearch-plugin install analysis-icu
