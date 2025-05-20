export interface SuccessDecorator<A> {
  isSuccess: boolean;
  errors: string[];
  value: A;
}
