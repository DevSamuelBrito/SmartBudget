using System.Globalization;
using ClosedXML.Excel;
using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Infrastructure.Reports;

public class ExcelReportService : IExcelReportService
{
    private const string CurrencyFormat = "\"R$\" #,##0.00";
    private const string PercentageFormat = "0.00\"%\"";

    public Task<byte[]> GenerateMonthlyReportAsync(MonthlyReportDto report)
    {
        using var workbook = new XLWorkbook();

        BuildSummarySheet(workbook, report);
        BuildTransactionsSheet(workbook, report);
        BuildCategoriesSheet(workbook, report);

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);

        return Task.FromResult(stream.ToArray());
    }

    private static void BuildSummarySheet(XLWorkbook workbook, MonthlyReportDto report)
    {
        var sheet = workbook.Worksheets.Add("Resumo");
        var monthName = CultureInfo.GetCultureInfo("pt-BR").DateTimeFormat.GetMonthName(report.Month);

        sheet.Cell(1, 1).Value = $"Relatório Mensal - {monthName}/{report.Year}";
        sheet.Cell(1, 1).Style.Font.Bold = true;
        sheet.Cell(1, 1).Style.Font.FontSize = 14;
        sheet.Range(1, 1, 1, 2).Merge();

        sheet.Cell(3, 1).Value = "Usuário";
        sheet.Cell(3, 1).Style.Font.Bold = true;
        sheet.Cell(3, 2).Value = report.UserName;

        sheet.Cell(4, 1).Value = "Receita Total";
        sheet.Cell(4, 1).Style.Font.Bold = true;
        sheet.Cell(4, 2).Value = report.TotalIncome;
        sheet.Cell(4, 2).Style.NumberFormat.Format = CurrencyFormat;

        sheet.Cell(5, 1).Value = "Despesa Total";
        sheet.Cell(5, 1).Style.Font.Bold = true;
        sheet.Cell(5, 2).Value = report.TotalExpense;
        sheet.Cell(5, 2).Style.NumberFormat.Format = CurrencyFormat;

        sheet.Cell(6, 1).Value = "Saldo";
        sheet.Cell(6, 1).Style.Font.Bold = true;
        sheet.Cell(6, 2).Value = report.Balance;
        sheet.Cell(6, 2).Style.NumberFormat.Format = CurrencyFormat;
        sheet.Cell(6, 2).Style.Font.Bold = true;
        sheet.Cell(6, 2).Style.Font.FontColor = report.Balance >= 0 ? XLColor.DarkGreen : XLColor.DarkRed;

        sheet.Columns().AdjustToContents();
    }

    private static void BuildTransactionsSheet(XLWorkbook workbook, MonthlyReportDto report)
    {
        var sheet = workbook.Worksheets.Add("Transações");

        string[] headers = ["Data", "Descrição", "Categoria", "Tipo", "Valor", "Recorrência"];
        for (var i = 0; i < headers.Length; i++)
        {
            sheet.Cell(1, i + 1).Value = headers[i];
            sheet.Cell(1, i + 1).Style.Font.Bold = true;
        }

        var row = 2;
        foreach (var transaction in report.Transactions.OrderBy(t => t.Date))
        {
            sheet.Cell(row, 1).Value = transaction.Date;
            sheet.Cell(row, 1).Style.NumberFormat.Format = "dd/MM/yyyy";
            sheet.Cell(row, 2).Value = transaction.Description;
            sheet.Cell(row, 3).Value = transaction.CategoryName;
            sheet.Cell(row, 4).Value = MapTransactionType(transaction.Type);
            sheet.Cell(row, 5).Value = transaction.Amount;
            sheet.Cell(row, 5).Style.NumberFormat.Format = CurrencyFormat;
            sheet.Cell(row, 6).Value = MapRecurrence(transaction.Recurrence);
            row++;
        }

        sheet.Columns().AdjustToContents();
    }

    private static void BuildCategoriesSheet(XLWorkbook workbook, MonthlyReportDto report)
    {
        var sheet = workbook.Worksheets.Add("Categorias");

        string[] headers = ["Categoria", "Total Gasto", "% do Orçamento", "Limite do Orçamento", "Status"];
        for (var i = 0; i < headers.Length; i++)
        {
            sheet.Cell(1, i + 1).Value = headers[i];
            sheet.Cell(1, i + 1).Style.Font.Bold = true;
        }

        var row = 2;
        foreach (var category in report.CategorySummary)
        {
            sheet.Cell(row, 1).Value = category.CategoryName;
            sheet.Cell(row, 2).Value = category.TotalSpent;
            sheet.Cell(row, 2).Style.NumberFormat.Format = CurrencyFormat;
            sheet.Cell(row, 3).Value = category.Percentage;
            sheet.Cell(row, 3).Style.NumberFormat.Format = PercentageFormat;
            sheet.Cell(row, 4).Value = category.BudgetLimit;
            sheet.Cell(row, 4).Style.NumberFormat.Format = CurrencyFormat;
            sheet.Cell(row, 5).Value = MapBudgetStatus(category.BudgetStatus);
            row++;
        }

        sheet.Columns().AdjustToContents();
    }

    private static string MapTransactionType(FinancialTransactionType type) => type switch
    {
        FinancialTransactionType.Income => "Receita",
        FinancialTransactionType.Expense => "Despesa",
        FinancialTransactionType.Transfer => "Transferência",
        _ => type.ToString()
    };

    private static string MapRecurrence(RecurrenceType recurrence) => recurrence switch
    {
        RecurrenceType.Monthly => "Mensal",
        RecurrenceType.None => "Nenhuma",
        _ => recurrence.ToString()
    };

    private static string MapBudgetStatus(BudgetStatus? status) => status switch
    {
        BudgetStatus.Ok => "Dentro do limite",
        BudgetStatus.Warning => "Atenção",
        BudgetStatus.Exceeded => "Estourado",
        null => "Sem orçamento",
        _ => status.ToString() ?? "Sem orçamento"
    };
}
