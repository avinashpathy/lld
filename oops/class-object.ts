class BankAccount {
    private accountNumber: number;
    private balance: number;
    private ownerName: string;

    constructor(accountNumber: number, ownerName: string){
        this.accountNumber = accountNumber;
        this.ownerName = ownerName;
        this.balance = 0;
    }

    deposit(amount: number):void{
        if(amount>0){
            this.balance+=amount;
        }
    }

    withdraw(amount:number){
        if(amount>0 && this.balance>=amount){
            this.balance-=amount;
            return true;
        }
        return false;
    }

    getBalance():number {
        return this.balance;
    }
}

const account = new BankAccount(123456, 'Avinash');
account.deposit(100);
account.withdraw(50);
const balance = account.getBalance();
console.log(balance);