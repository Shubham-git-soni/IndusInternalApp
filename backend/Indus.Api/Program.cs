using Microsoft.EntityFrameworkCore;   // ✅ Add this namespace
using Indus.Api.Data;
using Indus.Api.Repositories;
using Indus.Api.Services;              // ✅ Replace with the actual namespace where IndusDbContext is
using Microsoft.AspNetCore.Authentication.Cookies; // <-- Add this for Cookie Authentication

var builder = WebApplication.CreateBuilder(args); 

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Next.js port
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // 👈 Important for cookies
        });
});


// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Add this line to support controllers (needed if you plan to use Web API controllers)
builder.Services.AddControllers();

// ✅ Get the connection string from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// ✅ Register DbContext with the connection string
builder.Services.AddDbContext<IndusDbContext>(options =>
    options.UseSqlServer(connectionString)); 

// Register our services and repositories for Dependency Injection
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<AuthService>();  

// ***** YAHAN PAR AUTHENTICATION KA CODE ADD KAREIN *****
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "IndusApp.AuthCookie";
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
        
        // API ke liye zaroori events
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = 401; // Unauthorized
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = 403; // Forbidden
            return Task.CompletedTask;
        };
    });

// Authorization ko bhi register karein
builder.Services.AddAuthorization();
// ***** YAHAN TAK AUTHENTICATION KA CODE ADD HUA *****


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
// ***** YAHAN PAR AUTHENTICATION MIDDLEWARE ADD KAREIN *****
// Routing se pehle aur HttpsRedirection ke baad
app.UseAuthentication();
app.UseAuthorization();
// ***** YAHAN TAK MIDDLEWARE ADD HUA *****

app.MapControllers();  // ✅ Important: Enables controller endpoints


app.Run();
