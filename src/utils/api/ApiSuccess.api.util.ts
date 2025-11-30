import * as SucessType from "../../types/api/ApiSuccess.type";

class ApiSuccess<T> {
  statusCode: SucessType.statusCode;
  message: SucessType.message;
  data: T|null;

  constructor(
    statusCode: SucessType.statusCode,
    message: SucessType.message,
    data: T|null = null
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
export type ApiSuccessType<T> = InstanceType<typeof ApiSuccess<T>>;
export default ApiSuccess;
