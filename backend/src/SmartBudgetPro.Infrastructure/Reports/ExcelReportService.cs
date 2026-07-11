using System.Globalization;
using ClosedXML.Excel;
using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Infrastructure.Reports;

public class ExcelReportService : IExcelReportService
{
    private const string DefaultLocale = "pt-BR";
    private const string PercentageFormat = "0.00\"%\"";

    private static readonly Dictionary<string, Dictionary<FinancialTransactionType, string>> TransactionTypeLabels = new()
    {
        ["pt-BR"] = new()
        {
            [FinancialTransactionType.Income] = "Receita",
            [FinancialTransactionType.Expense] = "Despesa",
            [FinancialTransactionType.Transfer] = "Transferência",
        },
        ["en"] = new()
        {
            [FinancialTransactionType.Income] = "Income",
            [FinancialTransactionType.Expense] = "Expense",
            [FinancialTransactionType.Transfer] = "Transfer",
        },
    };

    private static readonly Dictionary<string, Dictionary<RecurrenceType, string>> RecurrenceLabels = new()
    {
        ["pt-BR"] = new()
        {
            [RecurrenceType.Monthly] = "Mensal",
            [RecurrenceType.None] = "Nenhuma",
        },
        ["en"] = new()
        {
            [RecurrenceType.Monthly] = "Monthly",
            [RecurrenceType.None] = "None",
        },
    };

    private static readonly Dictionary<string, Dictionary<string, string>> BudgetStatusLabels = new()
    {
        ["pt-BR"] = new()
        {
            ["Ok"] = "Dentro do limite",
            ["Warning"] = "Atenção",
            ["Exceeded"] = "Estourado",
            ["None"] = "Sem orçamento",
        },
        ["en"] = new()
        {
            ["Ok"] = "Within limit",
            ["Warning"] = "Warning",
            ["Exceeded"] = "Exceeded",
            ["None"] = "No budget",
        },
    };

    private static readonly Dictionary<string, Dictionary<string, string>> SheetNameLabels = new()
    {
        ["pt-BR"] = new()
        {
            ["Summary"] = "Resumo",
            ["Transactions"] = "Transações",
            ["Categories"] = "Categorias",
        },
        ["en"] = new()
        {
            ["Summary"] = "Summary",
            ["Transactions"] = "Transactions",
            ["Categories"] = "Categories",
        },
    };

    private static readonly Dictionary<string, Dictionary<string, string>> SummaryFieldLabels = new()
    {
        ["pt-BR"] = new()
        {
            ["User"] = "Usuário",
            ["TotalIncome"] = "Receita Total",
            ["TotalExpense"] = "Despesa Total",
            ["Balance"] = "Saldo",
        },
        ["en"] = new()
        {
            ["User"] = "User",
            ["TotalIncome"] = "Total Income",
            ["TotalExpense"] = "Total Expense",
            ["Balance"] = "Balance",
        },
    };

    private static readonly Dictionary<string, string[]> TransactionsHeaderLabels = new()
    {
        ["pt-BR"] = ["Data", "Descrição", "Categoria", "Tipo", "Valor", "Recorrência"],
        ["en"] = ["Date", "Description", "Category", "Type", "Amount", "Recurrence"],
    };

    private static readonly Dictionary<string, string[]> CategoriesHeaderLabels = new()
    {
        ["pt-BR"] = ["Categoria", "Total Gasto", "% do Orçamento", "Limite do Orçamento", "Status"],
        ["en"] = ["Category", "Total Spent", "% of Budget", "Budget Limit", "Status"],
    };

    private static readonly XLColor HeaderFill = XLColor.FromHtml("#1F4E78");
    private static readonly XLColor HeaderFont = XLColor.White;
    private static readonly XLColor GoodFill = XLColor.FromHtml("#C6EFCE");
    private static readonly XLColor GoodFont = XLColor.FromHtml("#006100");
    private static readonly XLColor BadFill = XLColor.FromHtml("#FFC7CE");
    private static readonly XLColor BadFont = XLColor.FromHtml("#9C0006");
    private static readonly XLColor NeutralFill = XLColor.FromHtml("#FFEB9C");
    private static readonly XLColor NeutralFont = XLColor.FromHtml("#9C6500");
    private static readonly XLColor ZebraFill = XLColor.FromHtml("#F2F2F2");
    private static readonly XLColor BorderColor = XLColor.FromHtml("#B7B7B7");
    private static readonly XLColor DataBarColor = XLColor.FromHtml("#63C384");

    public Task<byte[]> GenerateMonthlyReportAsync(MonthlyReportDto report)
    {
        var locale = NormalizeLocale(report.Locale);
        var culture = ResolveCulture(locale);

        using var workbook = new XLWorkbook();

        BuildSummarySheet(workbook, report, locale, culture);
        BuildTransactionsSheet(workbook, report, locale, culture);
        BuildCategoriesSheet(workbook, report, locale, culture);

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);

        return Task.FromResult(stream.ToArray());
    }

    private static void BuildSummarySheet(XLWorkbook workbook, MonthlyReportDto report, string locale, CultureInfo culture)
    {
        var sheet = workbook.Worksheets.Add(GetSheetName("Summary", locale));
        var monthName = culture.DateTimeFormat.GetMonthName(report.Month);
        var currencyFormat = GetCurrencyFormat(culture);

        var titleRange = sheet.Range(1, 1, 1, 2);
        sheet.Cell(1, 1).Value = $"Relatório Mensal - {monthName}/{report.Year}";
        titleRange.Merge();
        titleRange.Style.Font.Bold = true;
        titleRange.Style.Font.FontSize = 16;
        titleRange.Style.Font.FontColor = HeaderFont;
        titleRange.Style.Fill.BackgroundColor = HeaderFill;
        titleRange.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        titleRange.Style.Border.BottomBorder = XLBorderStyleValues.Medium;
        titleRange.Style.Border.BottomBorderColor = HeaderFill;
        sheet.Row(1).Height = 26;

        var separatorRange = sheet.Range(2, 1, 2, 2);
        separatorRange.Style.Border.BottomBorder = XLBorderStyleValues.Medium;
        separatorRange.Style.Border.BottomBorderColor = HeaderFill;
        sheet.Row(2).Height = 8;

        sheet.Cell(3, 1).Value = GetSummaryFieldLabel("User", locale);
        sheet.Cell(3, 1).Style.Font.Bold = true;
        sheet.Cell(3, 2).Value = report.UserName;

        sheet.Cell(4, 1).Value = GetSummaryFieldLabel("TotalIncome", locale);
        sheet.Cell(4, 1).Style.Font.Bold = true;
        sheet.Cell(4, 2).Value = report.TotalIncome;
        sheet.Cell(4, 2).Style.NumberFormat.Format = currencyFormat;

        sheet.Cell(5, 1).Value = GetSummaryFieldLabel("TotalExpense", locale);
        sheet.Cell(5, 1).Style.Font.Bold = true;
        sheet.Cell(5, 2).Value = report.TotalExpense;
        sheet.Cell(5, 2).Style.NumberFormat.Format = currencyFormat;

        sheet.Cell(6, 1).Value = GetSummaryFieldLabel("Balance", locale);
        sheet.Cell(6, 1).Style.Font.Bold = true;
        sheet.Cell(6, 2).Value = report.Balance;
        sheet.Cell(6, 2).Style.NumberFormat.Format = currencyFormat;
        sheet.Cell(6, 2).Style.Font.Bold = true;
        sheet.Cell(6, 2).Style.Font.FontColor = report.Balance >= 0 ? GoodFont : BadFont;

        sheet.Range(4, 1, 4, 2).Style.Fill.BackgroundColor = GoodFill;
        sheet.Range(5, 1, 5, 2).Style.Fill.BackgroundColor = BadFill;
        sheet.Range(6, 1, 6, 2).Style.Fill.BackgroundColor = ZebraFill;

        ApplyBorders(titleRange);
        ApplyBorders(sheet.Range(3, 1, 6, 2));

        sheet.Columns().AdjustToContents();
        EnforceMinColumnWidth(sheet, 1, 20);
        EnforceMinColumnWidth(sheet, 2, 18);
    }

    private static void BuildTransactionsSheet(XLWorkbook workbook, MonthlyReportDto report, string locale, CultureInfo culture)
    {
        var sheet = workbook.Worksheets.Add(GetSheetName("Transactions", locale));
        var currencyFormat = GetCurrencyFormat(culture);
        var dateFormat = GetDateFormat(locale);

        var headers = GetHeaders(TransactionsHeaderLabels, locale);
        for (var i = 0; i < headers.Length; i++)
        {
            sheet.Cell(1, i + 1).Value = headers[i];
        }
        ApplyHeaderStyle(sheet.Range(1, 1, 1, headers.Length));

        var row = 2;
        foreach (var transaction in report.Transactions.OrderBy(t => t.Date))
        {
            if ((row - 2) % 2 == 1)
            {
                sheet.Range(row, 1, row, headers.Length).Style.Fill.BackgroundColor = ZebraFill;
            }

            sheet.Cell(row, 1).Value = transaction.Date;
            sheet.Cell(row, 1).Style.NumberFormat.Format = dateFormat;
            sheet.Cell(row, 2).Value = transaction.Description;
            sheet.Cell(row, 3).Value = transaction.CategoryName;
            sheet.Cell(row, 4).Value = MapTransactionType(transaction.Type, locale);
            sheet.Cell(row, 5).Value = transaction.Amount;
            sheet.Cell(row, 5).Style.NumberFormat.Format = currencyFormat;
            sheet.Cell(row, 5).Style.Font.FontColor = GetAmountFontColor(transaction.Type);
            sheet.Cell(row, 5).Style.Font.Bold = true;
            sheet.Cell(row, 6).Value = MapRecurrence(transaction.Recurrence, locale);
            row++;
        }

        var lastRow = Math.Max(row - 1, 1);
        ApplyBorders(sheet.Range(1, 1, lastRow, headers.Length));

        sheet.Columns().AdjustToContents();
    }

    private static void BuildCategoriesSheet(XLWorkbook workbook, MonthlyReportDto report, string locale, CultureInfo culture)
    {
        var sheet = workbook.Worksheets.Add(GetSheetName("Categories", locale));
        var currencyFormat = GetCurrencyFormat(culture);

        var headers = GetHeaders(CategoriesHeaderLabels, locale);
        for (var i = 0; i < headers.Length; i++)
        {
            sheet.Cell(1, i + 1).Value = headers[i];
        }
        ApplyHeaderStyle(sheet.Range(1, 1, 1, headers.Length));

        var row = 2;
        foreach (var category in report.CategorySummary)
        {
            if ((row - 2) % 2 == 1)
            {
                sheet.Range(row, 1, row, headers.Length).Style.Fill.BackgroundColor = ZebraFill;
            }

            sheet.Cell(row, 1).Value = category.CategoryName;
            sheet.Cell(row, 2).Value = category.TotalSpent;
            sheet.Cell(row, 2).Style.NumberFormat.Format = currencyFormat;
            sheet.Cell(row, 3).Value = category.Percentage;
            sheet.Cell(row, 3).Style.NumberFormat.Format = PercentageFormat;
            sheet.Cell(row, 4).Value = category.BudgetLimit;
            sheet.Cell(row, 4).Style.NumberFormat.Format = currencyFormat;

            var statusCell = sheet.Cell(row, 5);
            statusCell.Value = MapBudgetStatus(category.BudgetStatus, locale);

            var (statusFill, statusFont) = GetStatusColors(category.BudgetStatus);
            if (statusFill is not null && statusFont is not null)
            {
                statusCell.Style.Fill.BackgroundColor = statusFill;
                statusCell.Style.Font.FontColor = statusFont;
                statusCell.Style.Font.Bold = true;
            }

            row++;
        }

        var lastRow = Math.Max(row - 1, 1);
        ApplyBorders(sheet.Range(1, 1, lastRow, headers.Length));

        if (lastRow >= 2)
        {
            sheet.Range(2, 3, lastRow, 3).AddConditionalFormat()
                .DataBar(DataBarColor, showBarOnly: false)
                .Minimum(XLCFContentType.Number, 0)
                .Maximum(XLCFContentType.Number, 100);
        }

        sheet.Columns().AdjustToContents();
    }

    private static void ApplyHeaderStyle(IXLRange range)
    {
        range.Style.Fill.BackgroundColor = HeaderFill;
        range.Style.Font.FontColor = HeaderFont;
        range.Style.Font.Bold = true;
        range.Style.Font.FontSize = 11;
        range.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        range.Worksheet.Row(range.RangeAddress.FirstAddress.RowNumber).Height = 20;
    }

    private static void ApplyBorders(IXLRange range)
    {
        range.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
        range.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
        range.Style.Border.OutsideBorderColor = BorderColor;
        range.Style.Border.InsideBorderColor = BorderColor;
    }

    private static void EnforceMinColumnWidth(IXLWorksheet sheet, int column, double minWidth)
    {
        if (sheet.Column(column).Width < minWidth)
        {
            sheet.Column(column).Width = minWidth;
        }
    }

    private static XLColor GetAmountFontColor(FinancialTransactionType type) => type switch
    {
        FinancialTransactionType.Income => GoodFont,
        FinancialTransactionType.Expense => BadFont,
        _ => XLColor.Black
    };

    private static (XLColor? Fill, XLColor? Font) GetStatusColors(BudgetStatus? status) => status switch
    {
        BudgetStatus.Ok => (GoodFill, GoodFont),
        BudgetStatus.Warning => (NeutralFill, NeutralFont),
        BudgetStatus.Exceeded => (BadFill, BadFont),
        _ => (null, null)
    };

    private static string NormalizeLocale(string? locale)
    {
        if (string.IsNullOrWhiteSpace(locale))
        {
            return DefaultLocale;
        }

        return locale.Trim().ToLowerInvariant() switch
        {
            "en" or "en-us" => "en",
            "pt-br" or "pt" => "pt-BR",
            _ => DefaultLocale
        };
    }

    private static CultureInfo ResolveCulture(string normalizedLocale)
    {
        var cultureName = normalizedLocale == "en" ? "en-US" : "pt-BR";

        try
        {
            return CultureInfo.GetCultureInfo(cultureName);
        }
        catch (CultureNotFoundException)
        {
            return CultureInfo.GetCultureInfo("pt-BR");
        }
    }

    private static string GetCurrencyFormat(CultureInfo culture) =>
        $"\"{culture.NumberFormat.CurrencySymbol}\" #,##0.00";

    private static string GetDateFormat(string normalizedLocale) => normalizedLocale == "en"
        ? "MM/dd/yyyy"
        : "dd/MM/yyyy";

    private static string MapTransactionType(FinancialTransactionType type, string locale)
    {
        var labels = TransactionTypeLabels.GetValueOrDefault(locale, TransactionTypeLabels[DefaultLocale]);
        return labels.GetValueOrDefault(type, type.ToString());
    }

    private static string MapRecurrence(RecurrenceType recurrence, string locale)
    {
        var labels = RecurrenceLabels.GetValueOrDefault(locale, RecurrenceLabels[DefaultLocale]);
        return labels.GetValueOrDefault(recurrence, recurrence.ToString());
    }

    private static string MapBudgetStatus(BudgetStatus? status, string locale)
    {
        var labels = BudgetStatusLabels.GetValueOrDefault(locale, BudgetStatusLabels[DefaultLocale]);
        var key = status?.ToString() ?? "None";
        return labels.GetValueOrDefault(key, key);
    }

    private static string GetSheetName(string key, string locale)
    {
        var labels = SheetNameLabels.GetValueOrDefault(locale, SheetNameLabels[DefaultLocale]);
        return labels.GetValueOrDefault(key, key);
    }

    private static string GetSummaryFieldLabel(string key, string locale)
    {
        var labels = SummaryFieldLabels.GetValueOrDefault(locale, SummaryFieldLabels[DefaultLocale]);
        return labels.GetValueOrDefault(key, key);
    }

    private static string[] GetHeaders(Dictionary<string, string[]> headerLabels, string locale) =>
        headerLabels.GetValueOrDefault(locale, headerLabels[DefaultLocale]);
}
