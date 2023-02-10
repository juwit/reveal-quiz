// @ts-ignore
import notie from 'notie'
import 'notie/dist/notie.css'

export interface NotificationService {
  info (text: string): void

  warn (text: string): void
}

class NotificationServiceImpl implements NotificationService {
  info (text: string): void {
    this.alert('info', text)
  }

  warn (text: string): void {
    this.alert('warning', text)
  }

  private alert (type: string, text: string): void {
    notie.alert({
      type,
      text,
    })
  }
}

const instance = new NotificationServiceImpl()
export default instance
