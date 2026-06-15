// NotificationChannel interface
interface NotificationChannel {
  send(message: string): void;
}

// Concrete channels
class EmailChannel implements NotificationChannel {
  send(message: string): void {
    console.log(`Sending EMAIL: ${message}`);
  }
}

class SMSChannel implements NotificationChannel {
  send(message: string): void {
    console.log(`Sending SMS: ${message}`);
  }
}

class PushChannel implements NotificationChannel {
  send(message: string): void {
    console.log(`Sending PUSH: ${message}`);
  }
}

class SlackChannel implements NotificationChannel {
  send(message: string): void {
    console.log(`Sending SLACK: ${message}`);
  }
}

// Refactored service - no if-else
class NotificationService {
  private channels: NotificationChannel[];

  constructor(channels: NotificationChannel[]) {
    this.channels = channels;
  }

  sendNotification(message: string): void {
    for (const channel of this.channels) {
      channel.send(message);
    }
  }
}

// Main
const channels: NotificationChannel[] = [
  new EmailChannel(),
  new SMSChannel(),
  new PushChannel(),
  new SlackChannel(),
];

const service = new NotificationService(channels);
service.sendNotification("Your order has shipped!");