using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartBudgetPro.Infrastructure.Migrations
{
    public partial class AddIconToTransactionCategory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "TransactionCategories",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: string.Empty);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Icon",
                table: "TransactionCategories");
        }
    }
}