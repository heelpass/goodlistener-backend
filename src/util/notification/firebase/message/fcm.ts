import * as admin from 'firebase-admin';
import { randomUUID } from 'crypto';
export class Fcm {
  init() {
    admin.initializeApp({
      credential: admin.credential.cert(this.config() as admin.ServiceAccount),
    });
  }

  private config() {
    return {
      project_id: process.env.project_id,
      private_key_id: process.env.private_key_id,
      private_key: process.env.private_key,
      client_email: process.env.client_email,
      client_id: process.env.client_id,
      auth_uri: process.env.auth_uri,
      token_uri: process.env.token_uri,
      auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
      client_x509_cert_url: process.env.client_x509_cert_url,
    };
  }

  /**
   * @param userToken 'userFcmToken'
   * @param flag {string} 'call | match | before5minute'
   * @param message 'message'
   */
  async pushMessage(userToken: string, flag: string, message: any) {
    const payload = {
      notification: {
        title: '[굿 리스너]',
        body: message, //'5분 뒤에 전화가 올 예정입니다. 놓치지 말고 꼭 받아주세요.',
      },
      data: {
        flag: flag || 'call', //'CALL_NOTIFICATION',
        hash: randomUUID(),
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: '[굿 리스너]',
              body: message, //'5분 뒤에 전화가 올 예정입니다. 놓치지 말고 꼭 받아주세요.',
            },
            'mutable-content': 1,
          },
        },
      },
      token: userToken,
    };

    admin
      .messaging()
      .send(payload, false)
      .then((res) => console.log('success' + res))
      .catch((err) => console.log(err));
  }
}
