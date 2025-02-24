FROM node:14-alpine

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm install

# Then copy the rest of the code
COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]