FROM node:carbon


COPY ./docker/entrypoint.sh /entrypoint/

RUN ["chmod", "+x", "entrypoint/entrypoint.sh"]

# Copy or mount node app here
WORKDIR /data/

COPY package*.json ./


EXPOSE 8080:8080

ENTRYPOINT ["/entrypoint/entrypoint.sh"]

CMD ["npm", "start"]
