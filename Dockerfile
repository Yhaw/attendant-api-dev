################################
# 🧑 BUILD FOR LOCAL DEVELOPMENT
################################

# base image
FROM node:18-alpine As development

# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat

# Create app directory
WORKDIR /usr/src/app

# Set to dev environment
ENV NODE_ENV development

# A wildcard is used to ensure both package.json AND yarn.lock are copied
COPY --chown=node:node package*.json yarn.lock ./

# Install dependencies
# RUN yarn --frozen-lockfile
RUN yarn install

# Bundle app source
COPY --chown=node:node . .

# Add ORM and Database Migration setup Here

# Use the node user from the image (instead of the root user)
USER node


################################
# 🏡 BUILD FOR PRODUCTION
################################

# base image
FROM node:18-alpine As build

# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat

# Create app directory
WORKDIR /usr/src/app

# Set to production environment
ENV NODE_ENV production

# A wildcard is used to ensure both package.json AND yarn.lock are copied
COPY --chown=node:node package*.json yarn.lock ./

## In order to run `yarn build` we need access to the Nest CLI which is a dev dependency. 
## In the previous development stage we ran `yarn install` which installed all dependencies, 
## so we can copy over the node_modules directory from the development image
# COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
# COPY --chown=node:node . .

# Install all dependencies again (this will recompile native modules)
RUN yarn install

# Copy app source
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN yarn build

# Running `yarn install --production` ensures that only the production dependencies are installed. 
# RUN yarn --frozen-lockfile --production && yarn cache clean
RUN yarn install --production && yarn cache clean

USER node

################################
## 🚀 PRODUCTION 
################################

FROM node:18-alpine as production

# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Set Docker as non-root user
USER node

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
