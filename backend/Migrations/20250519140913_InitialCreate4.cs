using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "Papers",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Papers_AuthorId",
                table: "Papers",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Papers_Authors_AuthorId",
                table: "Papers",
                column: "AuthorId",
                principalTable: "Authors",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Papers_Authors_AuthorId",
                table: "Papers");

            migrationBuilder.DropIndex(
                name: "IX_Papers_AuthorId",
                table: "Papers");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "Papers");
        }
    }
}
