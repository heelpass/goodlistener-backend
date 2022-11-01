export class Message {
  private message(title, body, flag, token) {
    return {
      data: {
        flag: flag,
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: title,
              body: body,
            },
            'mutable-content': 1,
          },
        },
      },
      token: token,
    };
  }

  getCallNotification(token) {
    const title = '';
    const body = '';
    const flag = '';
    return this.message(title, body, flag, token);
  }
}
