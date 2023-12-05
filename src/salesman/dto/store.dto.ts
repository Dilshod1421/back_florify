import { ApiProperty } from "@nestjs/swagger";

export class StoreDto{
    @ApiProperty({
        example: '+998991234567',
        description: 'Phone number of store',
    })
    store_phone?: string;

    @ApiProperty({
        example: 'Navoiy, 12',
        description: 'Address of store',
    })
    store_address?: string;
}