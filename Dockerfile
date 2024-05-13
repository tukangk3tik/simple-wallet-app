FROM node:20.9.0
WORKDIR /home/api
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build
RUN chmod +x ./startup.sh
COPY . .
RUN ls -la
EXPOSE 8080

CMD ["sh","./startup.sh"]