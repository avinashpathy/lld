class ReportGenerator {
  generate(): string[][] {
    return [
      ["Name", "Sales", "Region"],
      ["Alice", "15000", "North"],
      ["Bob", "22000", "South"],
      ["Charlie", "18000", "East"],
    ];
  }
}

class ReportFormatter {
  formatAsCsv(data: string[][]): string {
    return data.map((row) => row.join(",")).join("\n");
  }
}

class ReportDistributor {
  distribute(recipient: string, formattedReport: string): void {
    console.log(`Sending report to: ${recipient}`);
    console.log(formattedReport);
    console.log("Report sent successfully.");
  }
}

const generator = new ReportGenerator();
const formatter = new ReportFormatter();
const distributor = new ReportDistributor();

const data = generator.generate();
const csv = formatter.formatAsCsv(data);
distributor.distribute("manager@company.com", csv);