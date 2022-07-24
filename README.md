# 협업 시 규칙

## 1. 개요

- 백엔드 개발 시 꼭 지켜서 협업했으면 하는 사항에 대한 기록

## 2. Code Convention

1. 코드는 camalcase를 사용하여 작성하도록 한다.
2. Git branch 전략을 베이스로 사용한다.
3. esLint에 기술한 코드 컨벤션을 따르도록 하고, 변경이 필요한 사항이 있다면 서로 협의 하 수정하도록 한다.
4. DB를 사용한 ORM의 서비스는 JPA를 따르도록 한다.
   1. 예시
   ```javascript
   const findByUserName = async () => {};
   const findByPostByUserId = async () => {};
   ```
5. 하나의 서비스 파일은 하나의 역할만 담당해야 하며, 외부오 연결되는 함수는 **exec** 를 `prefix`로 붙여 사용하도록 한다.
   1. 예시
   ```javascript
   const execDeleteUser = async () => {};
   ```
6. 각종 메시지(에러,로그,알림,유효성검사 등)은 상수화하여 사용한다.
7. 함수별 주석은 필수로 달아야 하며, `JsDoc`을 사용하여 작성한다.

## 3.Git Commit Message Rule

1. **feat**: 새로운 기능 추가 
2. **fix**: 버그 수정
3. **docs**: 문서 수정
4. **test**: 테스트 코드 추가
5. **refactor**: 코드 리팩토링
6. **style**: 코드 의미에 영향을 주지 않는 변경사항
7. **chore**: 빌드 부분 혹은 패키지 매니저 수정사항
8. **init**: 프로젝트 초기 셋팅

## 4. Git Convention

1. git commit

   1. 깃 커밋 시 하나의 기능만을 커밋하고, 여러 기능인 경우 기능별로 커밋한다.
   2. git commit 시 이슈번호와 커밋유형, 내용을 기록한다.

      1. 기능 추가에 대한 예시

      ```js
      [#1]Feat: 유저 로그인 유효성 파라미터 검사 유형 변경

      ----------------------------------------
      로그인 시 OO파라미터에 대한 유형을 `Number`에서 `String`으로 변경하였다.
      ```

2. git branch
   1. 각 기능별 branch로 분리하여 개발하고 개발이 완료되 사항에 대해 pull request를 올려 타 개발자의 승인 하 merge되도록 한다.
3. git issue
   1. 깃 이슈는 어떤 유형의 이슈인지를 확인하기 위해 태그를 사용한다.
   2. 이슈가 종료되면 해당 이슈를 Close처리한다.
