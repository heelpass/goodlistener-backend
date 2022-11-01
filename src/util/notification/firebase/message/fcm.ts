import * as admin from 'firebase-admin';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

type Nullable<T> = T | null;
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
      private_key: process.env.private_key.replace(/\\n/gm, '\n'),
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
   * @param token string token or null
   */
  async pushMessage(
    userToken: string,
    flag: string,
    content: any,
    token: string
  ) {
    console.log(this.config());
    const title = '[굿 리스너]';
    const hash = randomUUID();

    const payload = {
      notification: {
        title,
        body: content, //'5분 뒤에 전화가 올 예정입니다. 놓치지 말고 꼭 받아주세요.',
      },
      data: {
        flag: flag,
        hash,
        token: token,
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title,
              body: content, //'5분 뒤에 전화가 올 예정입니다. 놓치지 말고 꼭 받아주세요.',
            },
            'mutable-content': 1,
          },
        },
      },
      token: userToken,
    };

    return admin
      .messaging()
      .send(payload, false)
      .then((res) => ({ title, content, flag, hash }))
      .catch((err) => {
        console.log(err.message);
        throw new NotFoundException('FCM 토큰 오류');
      });
  }
}
