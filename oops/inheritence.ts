class BankAccount {
    protected ownerName:string;
    protected accountNumber: string;
    protected balance: number;

    constructor(ownerName: string, accountNumber: string, balance: number){
        this.ownerName=ownerName;
        this.accountNumber=accountNumber;
        this.balance=balance;
    }

    deposit(amount:number):boolean{
        if(amount>0){
            this.balance+=amount;
            return true;
        }
        return false;
    }

    withdraw(amount: number): boolean {
        if (amount > 0 && this.balance >= amount) {
            this.balance -= amount;
            return true;
        }
        return false;
    }

    displayAccount(): void {
        console.log(`${this.ownerName} (${this.accountNumber}) | Balance: $${this.balance.toFixed(2)}`);
    }
}

class SavingsAccount extends BankAccount {
    private interestRate: number;

    constructor(ownerName: string, accountNumber: string, balance: number, interestRate:number){
        super(ownerName,accountNumber,balance);
        this.interestRate=interestRate;
    }

    withdraw(amount: number): boolean {
        if (amount > 0 && (this.balance - amount) >= 100) {
            this.balance -= amount;
            return true;
        }
        return false;
    }

    applyInterest(): void {
        this.balance += this.balance * this.interestRate / 100;
    }
}

const savings = new SavingsAccount("Alice", "SAV-001", 1000, 2.0);
savings.displayAccount();
console.log("Withdraw $950: " + savings.withdraw(950));
savings.applyInterest();
savings.displayAccount();