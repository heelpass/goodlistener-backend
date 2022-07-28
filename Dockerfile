# 어떤 이미지로부터 새로운 이미지를 생성할지를 지정
FROM node:16

# /app 디렉토리 생성
RUN mkdir /app
# /app 디렉토리를 WORKDIR 로 설정
WORKDIR /app
# 현재 Dockerfile 있는 경로의 모든 파일을 /app 에 복사
ADD . /app
# yarn install 실행
RUN yarn install --frozen-lockfile
# yarn build 실행
RUN yarn build
# 환경변수 NODE_ENV 의 값을 development 로 설정
ENV NODE_ENV product
# 가상 머신에 오픈할 포트
EXPOSE 3000
# 컨테이너에서 실행될 명령을 지정
CMD ["yarn", "start:prod"]