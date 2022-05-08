import { ArgumentMetadata, BadRequestException, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
    async transform(value, metadata: ArgumentMetadata) {

        if (!value) {
            throw new BadRequestException('No data submitted');
        }

        const { metatype } = metadata

        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        console.dir(object);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new HttpException({
                statusCode: 400,
                message: 'Input data validation failed', 
                errors: this.buildError(errors)},
            HttpStatus.BAD_REQUEST);
        }
        return value;
    }

    private buildError(errors) {
        const result = {};
        errors.forEach(el => {
        const prop = el.property;
        Object.entries(el.constraints).forEach(constraint => {
            // console.log(errors)
            result[prop] = constraint[1];
        });
        });
        return result;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
}