namespace server.Common;

public class Result<T>
{
    public bool IsSuccess { get; init; }
    public T? Value { get; init; }
    public IEnumerable<string> Errors { get; init; } = [];

    public static Result<T> Success(T value) => new() { IsSuccess = true, Value = value, Errors = [] };
    public static Result<T> Failure(IEnumerable<string> errors) => new() { IsSuccess = false, Errors = errors };
}