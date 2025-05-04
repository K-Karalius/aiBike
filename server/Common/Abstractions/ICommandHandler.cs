namespace server.Common.Abstractions;

using System.Threading.Tasks;

public interface ICommandHandler<in TCommand, TResult>
{
    Task<Result<TResult>> Handle(TCommand request);
}
