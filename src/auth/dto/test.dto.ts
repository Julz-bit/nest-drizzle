import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class TestPayload {
    @ApiProperty()
    @IsNotEmpty()
    id: number

    @ApiProperty()
    @IsNotEmpty()
    status: string
}

export class TestDto {
    @ApiProperty({ type: [TestPayload] })
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => TestPayload)
    payload: TestPayload[]
}