using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class RefreshToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bike_Station_CurrentStationId",
                table: "Bike");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservation_AspNetUsers_UserId",
                table: "Reservation");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservation_Bike_BikeId",
                table: "Reservation");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservation_Station_StationId",
                table: "Reservation");

            migrationBuilder.DropForeignKey(
                name: "FK_Ride_AspNetUsers_UserId",
                table: "Ride");

            migrationBuilder.DropForeignKey(
                name: "FK_Ride_Bike_BikeId",
                table: "Ride");

            migrationBuilder.DropForeignKey(
                name: "FK_Ride_Station_EndStationId",
                table: "Ride");

            migrationBuilder.DropForeignKey(
                name: "FK_Ride_Station_StartStationId",
                table: "Ride");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Station",
                table: "Station");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Ride",
                table: "Ride");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reservation",
                table: "Reservation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Bike",
                table: "Bike");

            migrationBuilder.RenameTable(
                name: "Station",
                newName: "Stations");

            migrationBuilder.RenameTable(
                name: "Ride",
                newName: "Rides");

            migrationBuilder.RenameTable(
                name: "Reservation",
                newName: "Reservations");

            migrationBuilder.RenameTable(
                name: "Bike",
                newName: "Bikes");

            migrationBuilder.RenameIndex(
                name: "IX_Ride_UserId",
                table: "Rides",
                newName: "IX_Rides_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Ride_StartStationId",
                table: "Rides",
                newName: "IX_Rides_StartStationId");

            migrationBuilder.RenameIndex(
                name: "IX_Ride_EndStationId",
                table: "Rides",
                newName: "IX_Rides_EndStationId");

            migrationBuilder.RenameIndex(
                name: "IX_Ride_BikeId",
                table: "Rides",
                newName: "IX_Rides_BikeId");

            migrationBuilder.RenameIndex(
                name: "IX_Reservation_UserId",
                table: "Reservations",
                newName: "IX_Reservations_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Reservation_StationId",
                table: "Reservations",
                newName: "IX_Reservations_StationId");

            migrationBuilder.RenameIndex(
                name: "IX_Reservation_BikeId",
                table: "Reservations",
                newName: "IX_Reservations_BikeId");

            migrationBuilder.RenameIndex(
                name: "IX_Bike_CurrentStationId",
                table: "Bikes",
                newName: "IX_Bikes_CurrentStationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Stations",
                table: "Stations",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Rides",
                table: "Rides",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reservations",
                table: "Reservations",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Bikes",
                table: "Bikes",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Token = table.Column<string>(type: "text", nullable: false),
                    Expires = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Revoked = table.Column<bool>(type: "boolean", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_Token",
                table: "RefreshTokens",
                column: "Token",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Bikes_Stations_CurrentStationId",
                table: "Bikes",
                column: "CurrentStationId",
                principalTable: "Stations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_AspNetUsers_UserId",
                table: "Reservations",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Bikes_BikeId",
                table: "Reservations",
                column: "BikeId",
                principalTable: "Bikes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Stations_StationId",
                table: "Reservations",
                column: "StationId",
                principalTable: "Stations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Rides_AspNetUsers_UserId",
                table: "Rides",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Rides_Bikes_BikeId",
                table: "Rides",
                column: "BikeId",
                principalTable: "Bikes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Rides_Stations_EndStationId",
                table: "Rides",
                column: "EndStationId",
                principalTable: "Stations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Rides_Stations_StartStationId",
                table: "Rides",
                column: "StartStationId",
                principalTable: "Stations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bikes_Stations_CurrentStationId",
                table: "Bikes");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_AspNetUsers_UserId",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Bikes_BikeId",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Stations_StationId",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Rides_AspNetUsers_UserId",
                table: "Rides");

            migrationBuilder.DropForeignKey(
                name: "FK_Rides_Bikes_BikeId",
                table: "Rides");

            migrationBuilder.DropForeignKey(
                name: "FK_Rides_Stations_EndStationId",
                table: "Rides");

            migrationBuilder.DropForeignKey(
                name: "FK_Rides_Stations_StartStationId",
                table: "Rides");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Stations",
                table: "Stations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Rides",
                table: "Rides");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reservations",
                table: "Reservations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Bikes",
                table: "Bikes");

            migrationBuilder.RenameTable(
                name: "Stations",
                newName: "Station");

            migrationBuilder.RenameTable(
                name: "Rides",
                newName: "Ride");

            migrationBuilder.RenameTable(
                name: "Reservations",
                newName: "Reservation");

            migrationBuilder.RenameTable(
                name: "Bikes",
                newName: "Bike");

            migrationBuilder.RenameIndex(
                name: "IX_Rides_UserId",
                table: "Ride",
                newName: "IX_Ride_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Rides_StartStationId",
                table: "Ride",
                newName: "IX_Ride_StartStationId");

            migrationBuilder.RenameIndex(
                name: "IX_Rides_EndStationId",
                table: "Ride",
                newName: "IX_Ride_EndStationId");

            migrationBuilder.RenameIndex(
                name: "IX_Rides_BikeId",
                table: "Ride",
                newName: "IX_Ride_BikeId");

            migrationBuilder.RenameIndex(
                name: "IX_Reservations_UserId",
                table: "Reservation",
                newName: "IX_Reservation_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Reservations_StationId",
                table: "Reservation",
                newName: "IX_Reservation_StationId");

            migrationBuilder.RenameIndex(
                name: "IX_Reservations_BikeId",
                table: "Reservation",
                newName: "IX_Reservation_BikeId");

            migrationBuilder.RenameIndex(
                name: "IX_Bikes_CurrentStationId",
                table: "Bike",
                newName: "IX_Bike_CurrentStationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Station",
                table: "Station",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Ride",
                table: "Ride",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reservation",
                table: "Reservation",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Bike",
                table: "Bike",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Bike_Station_CurrentStationId",
                table: "Bike",
                column: "CurrentStationId",
                principalTable: "Station",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservation_AspNetUsers_UserId",
                table: "Reservation",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservation_Bike_BikeId",
                table: "Reservation",
                column: "BikeId",
                principalTable: "Bike",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservation_Station_StationId",
                table: "Reservation",
                column: "StationId",
                principalTable: "Station",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Ride_AspNetUsers_UserId",
                table: "Ride",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Ride_Bike_BikeId",
                table: "Ride",
                column: "BikeId",
                principalTable: "Bike",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Ride_Station_EndStationId",
                table: "Ride",
                column: "EndStationId",
                principalTable: "Station",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Ride_Station_StartStationId",
                table: "Ride",
                column: "StartStationId",
                principalTable: "Station",
                principalColumn: "Id");
        }
    }
}
