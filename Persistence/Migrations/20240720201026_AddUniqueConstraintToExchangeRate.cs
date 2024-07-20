using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueConstraintToExchangeRate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ExchangeRates_InputCurrencyCode_OutputCurrencyCode_Date",
                table: "ExchangeRates",
                columns: new[] { "InputCurrencyCode", "OutputCurrencyCode", "Date" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ExchangeRates_InputCurrencyCode_OutputCurrencyCode_Date",
                table: "ExchangeRates");
        }
    }
}
