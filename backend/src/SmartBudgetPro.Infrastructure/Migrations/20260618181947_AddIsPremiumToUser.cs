using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartBudgetPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPremiumToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Intentionally empty. Column IsPremium was added in the subsequent migration FixUserColumns.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Intentionally empty. See FixUserColumns migration.
        }
    }
}
