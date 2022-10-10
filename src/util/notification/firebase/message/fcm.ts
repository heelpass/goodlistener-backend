import * as admin from 'firebase-admin';
// import * as serviceAccount from '../../../../../firebase_key.json';

export class FcmManager {
  // init() {
  //   admin.initializeApp({
  //     // credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  //   });
  // }

  async pushMessage(message: any) {
    const userToken = 'ㅁㅁ';
    console.log(admin.app.name);

    const payload = {
      notification: {
        title: '[굿 리스너]',
        body: '5분 뒤에 전화가 올 예정입니다. 놓치지 말고 꼭 받아주세요.',
      },
      data: {
        flag: 'call', //'CALL_NOTIFICATION',
      },
      apns: {
        payload: {
          aps: {
            alert: {
              body: 'test',
              title: 'test',
            },
            'mutable-content': 1,
          },
        },
      },
      token: userToken,
    };

    // admin
    //   .messaging()
    //   .send(payload, false)
    //   .then((res) => console.log('success' + res))
    //   .catch((err) => console.log(err));
  }
}
