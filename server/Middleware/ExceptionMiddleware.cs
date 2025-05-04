using System.Text.Json;

namespace server.Middleware;

public class ExceptionMiddleware(RequestDelegate nextDelegate)
{
    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await nextDelegate(httpContext);
        }
        catch (Exception)
        {
            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
            var errorResponse = new { Message = "An unexpected error occurred." };
            var errorPayload = JsonSerializer.Serialize(errorResponse);
            await httpContext.Response.WriteAsync(errorPayload);
        }
    }
}