using Clinic.Persistence;
using Clinic.Services;
using Clinic.Web.Endpoints;
using Microsoft.EntityFrameworkCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyDbContext"));
});
builder.Services
    .AddScoped<AppointmentsService>()
    .AddScoped<TimeSlotsService>();

builder.Services.AddCors();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();

app.UseCors(option =>
{
    option.AllowAnyHeader();
    option.AllowAnyMethod();
    option.AllowAnyOrigin();
});

RouteGroupBuilder apigroup = app.MapGroup("api");

apigroup.MapAppointmentsEndpoints();
apigroup.MapTimeSlotsEndpoints();

app.Run();
