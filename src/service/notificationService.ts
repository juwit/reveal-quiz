// @ts-ignore
const notie = window.notie

export interface NotificationService {
  info (text: string): void
  warn (text: string): void
}

class NotificationServiceImpl implements NotificationService {
  private alert(type: string, text: string): void {
    notie.alert({
      type,
      text,
    });
  }

  info (text: string): void {
    this.alert('info', text);
  }

  warn (text: string): void {
    this.alert('warning', text);
  }
}

const instance = new NotificationServiceImpl();
export default instance;
