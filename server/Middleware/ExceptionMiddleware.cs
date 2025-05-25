using System.Text.Json;

namespace server.Middleware;

public class ExceptionMiddleware(RequestDelegate nextDelegate, ILogger<ExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await nextDelegate(httpContext);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An unexpected error occurred while processing the request at {Path}", httpContext.Request.Path);

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

            var errorResponse = new { Message = "An unexpected error occurred." };
            var errorPayload = JsonSerializer.Serialize(errorResponse);
            await httpContext.Response.WriteAsync(errorPayload);
        }
    }
}