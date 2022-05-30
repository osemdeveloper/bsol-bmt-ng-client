export class User {
  userId: number;
  userName: string;
  email: string;
  phone: any;
  address: string;
  password: string;
  constructor(user?: any) {
    this.userId = user.userId || 0;
    this.userName = user.userName || null;
    this.email = user.email || null;
    this.address = user.address || null;
    this.password = user.password || null;
  }
}
