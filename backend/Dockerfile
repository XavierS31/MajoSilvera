FROM public.ecr.aws/lambda/nodejs:20 AS build
WORKDIR ${LAMBDA_TASK_ROOT}
COPY package*.json ./
RUN npm ci --omit=dev
COPY tsconfig.json ./
COPY src ./src
RUN npm install --no-save typescript @types/node @types/aws-lambda @types/jsonwebtoken @types/pg && npx tsc

FROM public.ecr.aws/lambda/nodejs:20
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=build ${LAMBDA_TASK_ROOT}/node_modules ./node_modules
COPY --from=build ${LAMBDA_TASK_ROOT}/dist ./dist
CMD ["dist/index.handler"]
